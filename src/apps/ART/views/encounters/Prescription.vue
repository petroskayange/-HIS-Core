<template>
    <his-standard-form :cancelDestinationPath="cancelDestination" :fields="fields" @onSubmit="onSubmit" @onFinish="onFinish"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { RegimenInterface } from "@/interfaces/Regimen"
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import Validation from "@/components/Forms/validations/StandardValidations"
import { PrescriptionService } from "@/apps/ART/services/prescription_service"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { DrugInterface } from '@/interfaces/Drug'
import { isArray, isEmpty } from "lodash"
import HisDate from "@/utils/Date"
export default defineComponent({
    components: { HisStandardForm },
    data: () => ({
        prescription: {} as any,
        patient: {} as any,
        fields: [] as Array<Field>,
        form: {} as Record<string, Option> | Record<string, null>
    }),
    computed: {
        cancelDestination(): string {
            return this.getCancelDestination()
        } 
    },
    watch: {
        '$route': {
            async handler(route: any){
                if (!route || !route.params.p) return

                const { patient } = JSON.parse(route.params.p.toString())
                
                this.patient = patient
                this.fields = this.getFields()
                this.prescription = new PrescriptionService(this.patient.patient_id)
                await this.prescription.loadRegimenExtras()
                await this.prescription.load3HpStatus()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        getCancelDestination() {
            return `/patient/dashboard/${this.patient.patient_id}`
        },
        onFinish(form: Record<string, Option> | Record<string, null>) {
            this.form = form
        },
        async onSubmit() {
            const formData = this.resolveData(this.form)
            let drugs: Array<DrugInterface> = this.prescription.getRegimenExtras()
 
            const encounter = await this.prescription.createTreatmentEncounter()

            this.prescription.setNextVisitInterval(formData.next_visit_interval.value)
            
            if (!encounter) {
                return toastWarning('Unable to create treatment encounter')
            }
            
            if (this.hasArtRegimen(this.form)) {
               drugs = this.resolveDrugs([...drugs, ...formData.arv_regimens.other.regimens])
            }

            if (this.hasCustomRegimen(this.form)) {
                drugs = this.resolveDrugs(formData.custom_dosage.map((drug: Option) =>  drug.other))
            }

            const drugOrder = await this.prescription.createDrugOrder(drugs) 
            
            if(drugOrder) {
               toastSuccess('Drug order has been created')
               return this.$router.push({path: this.getCancelDestination()}) 
            }
            toastWarning('Unable to create drug orders!')
        },
        getDosageTableOptions(formData: any) {
            let regimens: Array<RegimenInterface> = this.prescription.getRegimenExtras()
            const columns = ['Drug name', 'Units', 'AM', 'Noon', 'PM', 'Frequency']

            if (this.hasArtRegimen(formData)) {
                regimens = [...regimens, ...formData.arv_regimens.other.regimens]
            }

            if (this.hasCustomRegimen(formData)) {
                regimens = formData.custom_dosage.map((regimen: Option) => regimen.other)
            }

            const rows = regimens.map((regimen: RegimenInterface) => {
                return [
                    regimen.alternative_drug_name || regimen.drug_name,
                    regimen.units,
                    regimen.am,
                    regimen.noon,
                    regimen.pm,
                    this.prescription.getDrugFrequency(regimen.drug_name)
                ]              
            })
            return [
                { 
                    label: 'Selected Medication', 
                    value:'Table', 
                    other: { columns, rows }
                }      
            ]
        },
        getDrugEstimates(formData: any, interval: number) {
            let regimens: Array<RegimenInterface> = []
            this.prescription.setNextVisitInterval(interval)

            const nextAppointment = this.prescription.calculateDateFromInterval()

            if (this.hasArtRegimen(formData)) {
                regimens = formData.arv_regimens.other.regimens
            }

            const drugPacks = regimens.map((regimen: RegimenInterface) => {
                const packSize = this.prescription.getDrugPackSize(regimen)
                const pillsPerDay = this.prescription.calculatePillsPerDay(regimen.am, regimen.noon, regimen.pm)
                const estimatedPackSize = this.prescription.estimatePackSize(pillsPerDay, packSize)     
                return {
                    label: regimen.alternative_drug_name || regimen.drug_name,
                    value: estimatedPackSize
                } 
            })

            return {
                label: 'Medication run-out date:',
                value: HisDate.toStandardHisDisplayFormat(nextAppointment),
                other: {
                    label: "Estimated packs/tins:",
                    value: drugPacks
                }
            }
        },
        resolveDrugs(regimens: Array<RegimenInterface>) {
            return regimens.map((regimen: any) => {
                return this.prescription.toOrderObj(
                    regimen.drug_id, 
                    regimen.drug_name,
                    regimen.units, 
                    regimen.am, 
                    regimen.pm,
                    regimen.frequency || ''
                )
            })
        },
        resolveData(form: Record<string, Option> | Record<string, null>) {
            const output: any = {}
            for(const name in form) {
                const data = form[name]
                
                if (isArray(data) && !isEmpty(data)) {
                    output[name] = data
                    continue
                }

                if (data && data.value != null) {
                    if ('other' in data) {
                        output[name] = data
                        continue
                    }
                    output[name] = data.value
                } 
            }
            return output
        },
        hasArtRegimen(formData: any) {
            return formData.regimen_type.value.match(/arv/, 'i')
        },
        hasCustomRegimen(formData: any) {
            return formData.regimen_type.value.match(/custom/, 'i')
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'regimen_type',
                    helpText: 'Select regimen type',
                    type: FieldType.TT_SELECT,
                    requireNext: false,
                    options: () => [
                        { label: 'ARV(s)', value: 'arv'},
                        { label: 'Custom Regimen', value: 'custom'}
                    ]
                },
                {
                    id: 'arv_regimens',
                    helpText: 'ARV Regimen(s)',
                    type: FieldType.TT_ART_REGIMEN_SELECTION,
                    condition: (form: any) => this.hasArtRegimen(form),
                    validation: (val: Option) => Validation.required(val),
                    options: async () => {
                        const regimenCategories = await this.prescription.getPatientRegimens()
                        const options = []
                        for(const index in regimenCategories) {
                            const regimens = regimenCategories[index]
                            const drug = regimens.map((regimen: RegimenInterface) => regimen.alternative_drug_name).join(' + ')
                            options.push({ label: drug, value: index, other: { regimens } })
                        }
                        return options
                    }
                },
                {
                    id: 'custom_regimen',
                    helpText: 'Custom prescription',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    condition: (form: any) => this.hasCustomRegimen(form),
                    validation: (val: Option) => Validation.required(val),
                    options: async () => {
                        const drugs = await this.prescription.getCustomIngridients()
                        return drugs.map((drug: any ) => ({
                            label: drug.name,
                            value: drug.drug_id,
                            other: { ...drug }
                        }))
                    },
                    config: {
                        showKeyboard: true
                    }
                },
                {
                    id: 'custom_dosage',
                    helpText: 'Custom dose',
                    type: FieldType.TT_DOSAGE_INPUT,
                    condition: (form: any) => this.hasCustomRegimen(form),
                    validation: (val: Option) => Validation.required(val),
                    options: (fdata: any) => {
                        return fdata.custom_regimen.map((regimen: Option) => ({
                            label: regimen.label,
                            value: regimen.value,
                            other: {
                                'drug_id': regimen.other.drug_id,
                                'drug_name': regimen.label,
                                'units': regimen.other.units,
                                'am': 0,
                                'noon': 0,
                                'pm': 0,
                                'frequency': 'Daily (QOD)'
                            }
                        }))
                    }
                },
                {
                    id: 'selected_meds',
                    helpText: 'Selected medication',
                    type: FieldType.TT_TABLE_VIEWER,
                    options: (fdata: any) => this.getDosageTableOptions(fdata)
                },
                {
                    id: 'next_visit_interval',
                    helpText: 'Interval to next visit',
                    type: FieldType.TT_NEXT_VISIT_INTERVAL_SELECTION,
                    validation: (val: Option) => Validation.required(val),
                    options: (fdata: any) => {
                        const intervals = [
                            { label: '2 weeks', value: 14 },
                            { label: '1 month', value: 28 },
                            { label: '2 months', value: 56 },
                            { label: '3 months', value: 84 },
                            { label: '4 months', value: 112 },
                            { label: '5 months', value: 140 },
                            { label: '6 months', value: 168 },
                            { label: '7 months', value: 196 },
                            { label: '8 months', value: 224 },
                            { label: '9 months', value: 252 },
                            { label: '10 months', value: 280 },
                            { label: '11 months', value: 308 },                        
                            { label: '12 months', value: 336 },
                        ]
                        return intervals.map(interval => ({
                            ...interval, 
                            other: { ...this.getDrugEstimates(fdata, interval.value) }
                            })
                        )
                    },
                    config: {
                        showRegimenCardTitle: false
                    }
                }
            ]
        }
    }
})
</script>



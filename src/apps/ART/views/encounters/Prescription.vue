<template>
    <his-standard-form v-if="fields.length >= 1" :activeField="regimenType" :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { RegimenInterface } from "@/interfaces/Regimen"
import Validation from "@/components/Forms/validations/StandardValidations"
import { PrescriptionService } from "@/apps/ART/services/prescription_service"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { DrugInterface } from '@/interfaces/Drug'
import { isArray, isEmpty } from "lodash"
import HisDate from "@/utils/Date"
import EncounterMixinVue from './EncounterMixin.vue'
export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        regimenType: 'arv_regimens',
        prescription: {} as any,
        patientToolbar: [] as Array<Option>
    }),
    watch: {
        patient: {
            async handler(patient: any){
                if (!patient) return
                this.patientToolbar = await this.getPatientToolBar()
                this.prescription = new PrescriptionService(patient.getID())
                await this.prescription.loadRegimenExtras()
                await this.prescription.load3HpStatus()
                
                this.fields = this.getFields()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async onSubmit(form: Record<string, any>) {
            const formData = this.resolveData(form)
            let drugs: Array<DrugInterface> = this.prescription.getRegimenExtras()
 
            const encounter = await this.prescription.createTreatmentEncounter()

            this.prescription.setNextVisitInterval(formData.next_visit_interval.value)
            
            if (!encounter) {
                return toastWarning('Unable to create treatment encounter')
            }
            
            if (this.hasArtRegimen()) {
               drugs = this.resolveDrugs([...drugs, ...formData.arv_regimens.other.regimens])
            }

            if (this.hasCustomRegimen()) {
                drugs = this.resolveDrugs(formData.custom_dosage.map((drug: Option) =>  drug.other))
            }

            const drugOrder = await this.prescription.createDrugOrder(drugs) 
            
            if(drugOrder) {
               toastSuccess('Drug order has been created')
               return this.gotoPatientDashboard()
            }
            toastWarning('Unable to create drug orders!')
        },
        getDosageTableOptions(formData: any) {
            let regimens: Array<RegimenInterface> = this.prescription.getRegimenExtras()
            let colorCodes: Array<string> = []

            if (this.hasCustomRegimen()) {
                regimens = formData.custom_dosage.map((regimen: Option) => regimen.other)
            }
            
            if (this.hasArtRegimen()) {
                regimens = [...regimens, ...formData.arv_regimens.other.regimens]
                colorCodes = regimens.map((item: any) => {
                    const category = item.regimen_category
                    switch(category) {
                        case 'A':
                            return 'adult-regimen-formulation'
                        case 'P':
                            return 'pedaid-regimen-formulation'
                        default:
                            return ''
                    }
                })
            }

            const columns = ['Drug name', 'Units', 'AM', 'Noon', 'PM', 'Frequency']
            const rows = regimens.map((regimen: any) => {
                return [
                    regimen.alternative_drug_name || regimen.drug_name,
                    regimen.units,
                    regimen.am,
                    regimen.noon,
                    regimen.pm,
                    regimen.frequency || this.prescription.getDrugFrequency(regimen.drug_name)
                ]              
            })
            return [
                { 
                    label: 'Selected Medication', 
                    value:'Table', 
                    other: { columns, rows, colorCodes }
                }      
            ]
        },
        getDrugEstimates(formData: any, interval: number) {
            let regimens: Array<RegimenInterface> = []
            this.prescription.setNextVisitInterval(interval)

            const nextAppointment = this.prescription.calculateDateFromInterval()

            if (this.hasArtRegimen()) {
                regimens = formData.arv_regimens.other.regimens
            }

            if (this.hasCustomRegimen()) {
                regimens = formData.custom_dosage.map((drug: Option) => drug.other)
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
        hasArtRegimen() {
            return this.regimenType.match(/arv_regimens/i)
        },
        hasCustomRegimen() {
            return this.regimenType.match(/custom_regimen/i)
        },
        async getPatientToolBar() {
            const weight = await this.patient.getRecentWeight()
            return [
                { label: 'Age', value: `${this.patient.getAge()} Year(s)`},
                { label: 'Gender', value: this.patient.getGender()},
                { label: 'Current Regimen', value: this.programInfo.current_regimen},
                { label: 'Current weight', value: `${weight} kg(s)` || 'Unknown'},
                { label: 'Reason for change', value: 'N/A'}
            ]
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'arv_regimens',
                    helpText: 'ARV Regimen(s)',
                    type: FieldType.TT_ART_REGIMEN_SELECTION,
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
                    },
                    config: {
                        toolbarInfo: this.patientToolbar,
                        footerBtns: [
                            {
                                name: 'Custom Regimen',
                                size: 'large',
                                slot: 'end',
                                color: 'primary',
                                visible: false,
                                visibleOnStateChange: (state: Record<string, any>) => {
                                    return state.index === 0
                                },
                                onClick: () => {
                                    this.regimenType = 'custom_regimen'
                                }
                            }
                        ]
                    }
                },
                {
                    id: 'custom_regimen',
                    helpText: 'Custom prescription',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    condition: () => this.hasCustomRegimen(),
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
                        showKeyboard: true,
                        hiddenFooterBtns: [
                            'Back'
                        ],
                        footerBtns: [
                            {
                                name: 'Standard Regimen',
                                size: 'large',
                                slot: 'end',
                                color: 'primary',
                                visible: false,
                                visibleOnStateChange: (state: Record<string, any>) => {
                                    return state.index === 1
                                },
                                onClick: () => {
                                    this.regimenType = 'arv_regimens'
                                }
                            }
                        ]
                    }
                },
                {
                    id: 'custom_dosage',
                    helpText: 'Custom dose',
                    type: FieldType.TT_DOSAGE_INPUT,
                    condition: () => this.hasCustomRegimen(),
                    validation: (val: Option) => Validation.required(val),
                    options: (fdata: any) => {
                        return fdata.custom_regimen.map((regimen: Option) => ({
                            label: regimen.label,
                            value: regimen.value,
                            other: {
                                'drug_id': regimen.other.drug_id,
                                'drug_name': regimen.label,
                                'barcodes': regimen.other.barcodes,
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
                    options: (fdata: any) => this.getDosageTableOptions(fdata),
                    config: {
                        hiddenFooterBtns: [
                            'Clear'
                        ]
                    }
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

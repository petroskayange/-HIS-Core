<template>
    <his-standard-form :cancelDestinationPath="cancelDestination" :fields="fields" @onSubmit="onSubmit" @onFinish="onFinish"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { RegimenService } from "@/services/regimen_service"
import { RegimenInterface } from "@/interfaces/Regimen"
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import Validation from "@/components/Forms/validations/StandardValidations"
import { PrescriptionService } from "@/apps/ART/services/prescription_service"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { DrugInterface } from '@/interfaces/Drug'
export default defineComponent({
    components: { HisStandardForm },
    data: () => ({
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
            handler(route: any){
                if (!route || !route.params.p) return

                const { patient } = JSON.parse(route.params.p.toString())
                
                this.patient = patient
                this.fields = this.getFields()
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
            const prescription = new PrescriptionService(this.patient.patient_id)
            const formData = this.resolveData(this.form)
            let drugs: Array<DrugInterface> = []
            
            const encounter = await prescription.createTreatmentEncounter()

            prescription.setNextVisitInterval(parseInt(formData.next_visit_interval))
            
            if (!encounter) {
                return toastWarning('Unable to create treatment encounter')
            }
            
            if (formData.regimen_type.match(/arv/, 'i')) {
               drugs = this.resolveArvRegimenDrugs(prescription, formData.arv_regimens.other.regimens)
            }

            if(prescription.createDrugOrder(drugs)) {
               toastSuccess('Drug order has been created')
               return this.$router.push({path: this.getCancelDestination()}) 
            }
            toastWarning('Unable to create drug orders!')
        },
        resolveArvRegimenDrugs(prescriptionObj: any, regimens: Array<RegimenInterface>) {
            return regimens.map((regimen: RegimenInterface) => {
                return prescriptionObj.mapRegimenToDrug(regimen)
            })
        },
        resolveData(form: Record<string, Option> | Record<string, null>) {
            const output: any = {}
            for(const name in form) {
                const data = form[name]
                const filter = this.fields.filter(item => item.id === name)

                if (filter.length <= 0) continue 

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
                    type: FieldType.TT_SELECT,
                    condition: (form: any) => form.regimen_type.value.match(/arv/,'i'),
                    validation: (val: Option) => Validation.required(val),
                    options: async () => {
                        const regimenCategories = await RegimenService.getRegimens(this.patient.patient_id)
                        const options = []
                        for(const index in regimenCategories) {
                            const regimens = regimenCategories[index]
                            const label = regimens.map((regimen: RegimenInterface) => regimen.alternative_drug_name).join(' + ')
                            options.push({ label, value: index, other: { regimens } })
                        }
                        return options
                    }
                },
                {
                    id: 'custom_regimen',
                    helpText: 'Custom prescription',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    condition: (form: any) => form.regimen_type.value.match(/custom/,'i'),
                    validation: (val: Option) => Validation.required(val),
                    options: async () => {
                        const drugs = await RegimenService.getCustomIngridients()
                        return drugs.map((drug: any ) => ({
                            label: drug.name,
                            value: drug.drug_id
                        }))
                    },
                    config: {
                        showKeyboard: true
                    }
                },
                {
                    id: 'next_visit_interval',
                    helpText: 'Interval to next visit',
                    type: FieldType.TT_SELECT,
                    condition: (form: any) => form.regimen_type.value.match(/arv/,'i'),
                    validation: (val: Option) => Validation.required(val),
                    options: () =>[
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
                }
            ]
        }
    }
})
</script>



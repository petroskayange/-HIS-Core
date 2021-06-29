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
import HisDate from "@/utils/Date"
export default defineComponent({
    components: { HisStandardForm },
    data: () => ({
        patient: {} as any,
        fields: [] as Array<Field>,
        form: {} as Record<string, Option> | Record<string, null>
    }),
    computed: {
        cancelDestination(): string {
            return `/patient/dashboard/${this.patient.patient_id}`
        } 
    },
    watch: {
        '$route': {
            handler(route: any){
                console.log(route)
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
        onFinish(form: Record<string, Option> | Record<string, null>) {
            this.form = form
        },
        onSubmit() {
            console.log(this.form)
        },
        getDateInterval(days: number) {
            const dateObj = new Date(RegimenService.getSessionDate())
            dateObj.setDate(dateObj.getDate() + days)
            return HisDate.toStandardHisFormat(dateObj)
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
                            options.push({ label, value: index, isChecked: false, other: { regimens } })
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
                    id: 'drug_end_date',
                    helpText: 'Interval to next visit',
                    type: FieldType.TT_SELECT,
                    condition: (form: any) => form.regimen_type.value.match(/arv/,'i'),
                    validation: (val: Option) => Validation.required(val),
                    options: () =>[
                        { label: '2 weeks', value: 14},
                        { label: '1 month', value: 28},
                        { label: '2 months', value: 56},
                        { label: '3 months', value: 84},
                        { label: '4 months', value: 112},
                        { label: '5 months', value: 140},
                        { label: '6 months', value: 168},
                        { label: '7 months', value: 196},
                        { label: '8 months', value: 224},
                        { label: '9 months', value: 252},
                        { label: '10 months', value: 280},
                        { label: '11 months', value: 308},                        
                        { label: '12 months', value: 336},
                    ]
                }
            ]
        }
    }
})
</script>



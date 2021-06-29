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
        onsubmit() {
            console.log('Yay!')
        },
        mapToOption(listOptions: Array<string>): Array<Option> {
          return listOptions.map((item: any) => ({ label: item, value: item })) 
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
                    id: 'prescription_interval',
                    helpText: 'Interval to next visit',
                    type: FieldType.TT_SELECT,
                    condition: (form: any) => form.regimen_type.value.match(/arv/,'i'),
                    validation: (val: Option) => Validation.required(val),
                    options: () => this.mapToOption([
                        '2 weeks',
                        '1 month',
                        '2 months',
                        '3 months',
                        '4 months',
                        '5 months',
                        '6 months',
                        '7 months',
                        '8 months',
                        '9 months',
                        '10 months',
                        '11 months',
                        '12 months',
                    ])
                }
            ]
        }
    }
})
</script>



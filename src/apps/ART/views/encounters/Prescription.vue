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
                    options: () => this.mapToOption([
                        'ARV(s)',
                        'Custom Regimen'
                    ])
                },
                {
                    id: 'arv_regimens',
                    helpText: 'ARV Regimen(s)',
                    type: FieldType.TT_SELECT,
                    condition: (form: any) => form.regimen_type.label === 'ARV(s)',
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
                    condition: (form: any) => form.regimen_type.label.match('Custom Regimen'),
                    validation: (val: Option) => Validation.required(val),
                    options: async () => {
                        const drugs = await RegimenService.getCustomIngridients()
                        return drugs.map((drug: any ) => ({
                            label: drug.name,
                            value: drug.drug_id
                        }))
                    }
                }
            ]
        }
    }
})
</script>



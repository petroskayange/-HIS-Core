<template>
    <his-standard-form :skipSummary="true" :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { DispensationService } from "@/apps/ART/services/dispensation_service"
import EncounterMixinVue from './EncounterMixin.vue'
import Validation from "@/components/Forms/validations/StandardValidations"
import HisDate from "@/utils/Date"

export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        dispensation: {} as any
    }),
    watch: {
        patient: {
            async handler(patient: any){
                this.dispensation = new DispensationService(patient.getID())
                this.fields = this.getFields()
            },
            deep: true
        }
    },
    methods: {
        async onSubmit() {
            //TODO: save something
            this.nextTask()
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'dispense',
                    helpText: 'Dispensation',
                    type: FieldType.TT_DISPENSATION_INPUT,
                    config: {
                        toolbarInfo: [
                            { label: 'Name', value: 'Test patient' },
                            { label: 'Gender', value: 'Female' },
                            { label: 'Date Of Birth', value: '12/May/1994' }
                        ]
                    },
                    options: () => [
                        {
                            label: 'TDF300/3TC300/DTG50',
                            value: 0,
                            other: {
                                'amounted_needed': 30
                            }
                        },
                        {
                            label: 'Cotrimoxazole (960mg)',
                            value: 0,
                            other: {
                                'amounted_needed': 30
                            }
                        },
                        {
                            label: 'Rifapentine (150mg)',
                            value: 0,
                            other: {
                                'amounted_needed': 30
                            }
                        },
                        {
                            label: 'INH or H (Isoniazid 100mg tablet)',
                            value: 0,
                            other: {
                                'amounted_needed': 30
                            }
                        }
                    ]
                }
            ]
        }
    }
})
</script>

<template>
    <his-standard-form :skipSummary="true" :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
// import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { DispensationService } from "@/apps/ART/services/dispensation_service"
import EncounterMixinVue from './EncounterMixin.vue'
// import Validation from "@/components/Forms/validations/StandardValidations"
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
                await this.dispensation.loadCurrentDrugOrder()
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
        buildOrderOptions() {
            return this.dispensation.getCurrentOrder().map((d: any) => ({
                label: d.drug.name,
                value: d.quantity || 0,
                other: {
                    'drug_id': d.drug_id,
                    'order_id': d.order.order_id,
                    'amount_needed': d.amount_needed,
                    'pack_sizes': this.dispensation.getDrugPackSizes(d.drug_id)
                }
            }))
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'dispense',
                    helpText: 'Dispensation',
                    type: FieldType.TT_DISPENSATION_INPUT,
                    config: {
                        toolbarInfo: [
                            { label: 'Name', value: this.patient.getFullName() },
                            { label: 'Gender', value: this.patient.getGender() },
                            { label: 'Date Of Birth', value: HisDate.toStandardHisDisplayFormat(
                                this.patient.getBirthdate()
                            )}
                        ]
                    },
                    options: () => this.buildOrderOptions()
                }
            ]
        }
    }
})
</script>

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
                await this.dispensation.loadDrugHistory()

                this.fields = this.getFields()
            },
            deep: true
        }
    },
    methods: {
        async onSubmit() {
            this.nextTask()
        },
        buildMedicationHistory() {
            return this.dispensation.getDrugHistory().map((d: any) => ({
                medication: d.drug.name,
                date: HisDate.toStandardHisDisplayFormat(d.order.start_date),
                amount: d.quantity
            }))
        },
        buildOrderOptions() {
            return this.dispensation.getCurrentOrder().map((d: any) => ({
                label: d.drug.name,
                value: d.quantity || 0,
                other: {
                    'drug_id': d.drug.drug_id,
                    'order_id': d.order.order_id,
                    'amount_needed': this.calculateCompletePack(d),
                    'pack_sizes': this.dispensation.getDrugPackSizes(d.drug.drug_id)
                }
            }))
        },
        calculateCompletePack(order: any) {
            const units = parseFloat(order.amount_needed) - (order.quantity || 0)
            const completePack = this.dispensation.calcCompletePack(order, units)
            return completePack < 0 ? 0 : completePack
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'dispenses',
                    helpText: 'Dispensation',
                    type: FieldType.TT_DISPENSATION_INPUT,
                    onValue: async ({value, other}: Option) => {
                        const data = this.dispensation.buildDispensationPayload(other.order_id, value)
                        const res = await this.dispensation.saveDispensations([data])
                        if (res) return true

                        toastWarning('Unable to save dispensation')
                        return false
                    },
                    config: {
                        medicationHistory: this.buildMedicationHistory(),
                        toolbarInfo: [
                            { label: 'Name', value: this.patient.getFullName() },
                            { label: 'Gender', value: this.patient.getGender() },
                            { label: 'Date Of Birth', value: HisDate.toStandardHisDisplayFormat(
                                this.patient.getBirthdate()
                            )}
                        ],
                        hiddenFooterBtns: [ 
                            'Clear'
                        ]
                    },
                    options: () => this.buildOrderOptions()
                }
            ]
        }
    }
})
</script>

<template>
    <his-standard-form :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { AdherenceService } from "@/apps/ART/services/adherence_service"
import EncounterMixinVue from './EncounterMixin.vue'
import Validation from "@/components/Forms/validations/StandardValidations"
export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        adherence: {} as any,
        drugObs: [] as any,
        calculationAgreementObs: [] as any
    }),
    watch: {
        patient: {
            async handler(patient: any){
                if (!patient) return
                this.adherence = new AdherenceService(patient.getID())
                await this.adherence.loadPreviousDrugs()
                this.fields = this.getFields()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async onSubmit() {
            const encounter = await this.adherence.createEncounter()

            if (!encounter) return toastWarning('Unable to create encounter')

            const data = await Promise.all([...this.drugObs, ...this.calculationAgreementObs])
            const obs = await this.adherence.saveObservationList(data)

            if (!obs) return toastWarning('Unable to save patient observations')

            toastSuccess('Observations and encounter created!')

            this.nextTask()
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'pills_brought',
                    helpText: 'Pills remaining (brought to clinic)',
                    type: FieldType.TT_ADHERENCE_INPUT,
                    validation: (val: any) => Validation.required(val),
                    summaryMapValue: ({label, value}: Option) => ({ label: `${label}-Amount brought`, value }),
                    unload: async (data: any) => {
                        this.drugObs = []
                        data.forEach(async(val: Option) => {
                            const {drug, order, quantity } = val.other
                            const expected = this.adherence.calculateExpected(
                                quantity, val.other.equivalent_daily_dose, order.start_date
                            )
                            const adherence = this.adherence.calculateAdherence(
                                quantity, val.value, expected
                            )
                            this.drugObs.push(
                                this.adherence.buildAdherenceObs(order.order_id, drug.drug_id, adherence)
                            )
                            this.drugObs.push(
                                this.adherence.buildPillCountObs(order.order_id, val.value)
                            )
                        })
                    },
                    options: () => {
                        return this.adherence.getLastDrugs().map((data: any) => ({
                            label: data.drug.name,
                            value: '',
                            other: {
                                ...data
                            }
                        }))
                    }
                },
                {
                    id: "agree_with_calculation",
                    helpText: "Agree with adherence calculation",
                    type: FieldType.TT_SELECT,
                    validation: (val: Option) => Validation.required(val),
                    unload: ({ value }: Option) => {
                        this.calculationAgreementObs = [ this.adherence.buildValueCoded(
                            'Reason for poor treatment adherence', value
                        )]
                    },
                    options: () => [
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' }
                    ]
                }
            ]
        }
    }
})
</script>

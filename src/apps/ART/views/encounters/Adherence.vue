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
        drugObs: [] as any
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

            const obs = await this.adherence.saveObservationList(this.drugObs)

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
                            const {drug, order } = val.other
                            const adherence = 0 //TODO calculate adherence here
                            const adhrenceObs = await this.adherence.buildAdherenceObs(
                                order.order_id, drug.drug_id, adherence
                            )
                            const pillObs = await this.adherence.buildPillCountObs(
                                order.order_id, val.value
                            )
                            this.drugObs.push(adhrenceObs)
                            this.drugObs.push(pillObs)
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
                }
            ]
        }
    }
})
</script>

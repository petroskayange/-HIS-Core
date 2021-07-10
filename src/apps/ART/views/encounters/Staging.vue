<template>
    <his-standard-form :skipSummary="true" :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { RegimenInterface } from "@/interfaces/Regimen"
import Validation from "@/components/Forms/validations/StandardValidations"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { StagingService, StagingCategory } from "@/apps/ART/services/staging_service"
import HisDate from "@/utils/Date"
import EncounterMixinVue from './EncounterMixin.vue'
export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        staging: {} as any,
        observations: [] as any,
        summary: [] as any
    }),
    watch: {
        patient: {
            async handler(patient: any){
                if (!patient) return
                this.staging = new StagingService(
                    patient.getID(),
                    patient.getAge(),
                    patient.getGender()
                )
                this.fields = this.getFields()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async onSubmit() {
            console.log(this.observations)
            return this.nextTask()
        },
        getYesNoOptions() {
            return [
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" }
            ]
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'pregnancy_status',
                    helpText: 'Pregnant / Breastfeeding',
                    type: FieldType.TT_MULTIPLE_YES_NO,
                    condition: () => this.staging.isFemale(),
                    unload: async (data: any) => {
                        const observation = data.map((obs: Option) => {
                            this.summary.push({ label: obs.label, value: obs.value })
                            return this.staging.buildValueCoded(obs.other.concept, obs.value)
                        })
                        const values = await Promise.all(observation)
                        this.observations = [...this.observations, ...values]
                    },
                    options: () => [
                        {
                            label: 'Pregnant?',
                            value: '',
                            other: {
                                values: this.getYesNoOptions(),
                                concept: 'Is patient pregnant',
                            }
                        },
                        {
                            label: 'Breastfeeding?',
                            value: '',
                            other: {
                                values: this.getYesNoOptions(),
                                concept: 'Is patient breast feeding'
                            }
                        }
                    ]
                }, 
                {
                    id: '__form_summary__',
                    helpText: 'Summary',
                    type: FieldType.TT_SUMMARY,
                    config: {
                        hiddenFooterBtns: [ 'Clear' ]
                    },
                    options: () => this.summary 
                }
            ]
        }
    }
})
</script>

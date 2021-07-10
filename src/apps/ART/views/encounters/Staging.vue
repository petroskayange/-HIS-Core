<template>
    <his-standard-form :skipSummary="true" :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { StagingService, StagingCategory } from "@/apps/ART/services/staging_service"
import EncounterMixinVue from './EncounterMixin.vue'
export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        staging: {} as any,
        pregnancyObs: [] as any,
        stageFourObs: [] as any,
        stageThreeObs: [] as any,
        stageTwoObs: [] as any,
        stageOneObs: [] as any,
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
            const encounter = await this.staging.createStagingEncounter()

            if (!encounter) return toastWarning('Unable to create encounter')
            
            const data = await Promise.all([
                ...this.pregnancyObs, ... this.stageFourObs, 
                ...this.stageThreeObs, ...this.stageTwoObs, 
                ...this.stageOneObs
            ])
            
            const obs = await this.staging.createObs(data)

            if (!obs) return toastWarning('Unable to save patient observations')

            toastSuccess('Observations and encounter created!')

            this.nextTask()
        },
        getYesNoOptions() {
            return [
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" }
            ]
        },
        async setPregnancyObsData(data: Array<Option>) {
            const payload = data.map((obs: Option) => {
                return this.staging.buildValueCoded(obs.other.concept, obs.value)
            })
            this.pregnancyObs = await Promise.all(payload)
        },
        async buildStagingData(data: Array<Option>) {
            return data.map((item: Option) => {
                return this.staging.buildValueCoded('Who stages criteria present', item.label)
            })
        },
        mapStagingOptions(group: StagingCategory) {
            return this.staging.getStagingConditions(group).map((concept: any) => ({
                label: concept.name,
                value: concept.concept_id,
                isChecked: false
            }))
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'pregnancyObs_status',
                    helpText: 'Pregnant / Breastfeeding',
                    type: FieldType.TT_MULTIPLE_YES_NO,
                    condition: () => this.staging.isFemale(),
                    unload: async (data: any) => this.setPregnancyObsData(data),
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
                    id: 'stage_4_conditions',
                    helpText: 'Stage 4 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    unload: async (data: any) => this.stageFourObs = await this.buildStagingData(data),
                    options: () => this.mapStagingOptions(
                        this.staging.isAdult() ? StagingCategory.ADULT_STAGE_4 : StagingCategory.PEDAID_STAGE_4 
                    )
                },
                {
                    id: 'stage_3_conditions',
                    helpText: 'Stage 3 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    unload: async (data: any) => this.stageThreeObs = await this.buildStagingData(data),
                    options: () => this.mapStagingOptions(
                        this.staging.isAdult() ? StagingCategory.ADULT_STAGE_3 : StagingCategory.PEDAID_STAGE_3 
                    )
                },
                {
                    id: 'stage_2_conditions',
                    helpText: 'Stage 2 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    unload: async (data: any) => this.stageTwoObs = await this.buildStagingData(data),
                    options: () => this.mapStagingOptions(
                        this.staging.isAdult() ? StagingCategory.ADULT_STAGE_2 : StagingCategory.PEDAID_STAGE_2 
                    )
                },
                {
                    id: 'stage_1_conditions',
                    helpText: 'Stage 1 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    unload: async (data: any) => this.stageOneObs = await this.buildStagingData(data),
                    options: () => this.mapStagingOptions(
                        this.staging.isAdult() ? StagingCategory.ADULT_STAGE_1 : StagingCategory.PEDAID_STAGE_1 
                    )
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

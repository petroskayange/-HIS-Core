<template>
    <his-standard-form :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { StagingService, StagingCategory } from "@/apps/ART/services/staging_service"
import EncounterMixinVue from './EncounterMixin.vue'
import Validation from "@/components/Forms/validations/StandardValidations"
import MonthOptions from "@/components/FormElements/Presets/MonthOptions"
import HisDate from "@/utils/Date"
export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        staging: {} as any,
        pregnancyObs: [] as any,
        stageFourObs: [] as any,
        stageThreeObs: [] as any,
        stageTwoObs: [] as any,
        stageOneObs: [] as any,
        cd4Available: false as boolean,
        cd4Count: [] as any,
        cd4Date: [] as any,
        cd4Location: [] as any,
        cd4DateStr: '' as string,
        month: '' as string,
        year: '' as string
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
                ...this.stageOneObs, ...this.cd4Count,
                ...this.cd4Date, ...this.cd4Location
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
        async getFacilities(filter=''){
            const facilities = await this.staging.getFacilities(filter)
            return facilities.map((facility: any) => ({
                label: facility.name,
                value: facility.location_id
            }))
        },
        setPregnancyObsData(data: Array<Option>) {
            const payload = data.map((obs: Option) => {
                return this.staging.buildValueCoded(obs.other.concept, obs.value)
            })
            this.pregnancyObs = payload
        },
        buildStagingData(data: Array<Option>) {
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
        hasCd4Count(f: any) {
            return f.cd4_available && f.cd4_available.label === 'Yes'
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'pregnancyObs_status',
                    helpText: 'Pregnant / Breastfeeding',
                    type: FieldType.TT_MULTIPLE_YES_NO,
                    condition: () => this.staging.isFemale(),
                    summaryMapValue: (d: Option) => ({ label: d.label, value: d.value }),
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
                    id: 'patient_weight_chart',
                    helpText: 'Patient weight chart',
                    type: FieldType.TT_WEIGHT_CHART,
                    options: async () => {
                        const history = await this.patient.getWeightHistory()
                        const labels = history.map((i: any) => HisDate.toStandardHisDisplayFormat(i.date))
                        const values = history.map((i: any) => i.weight)
                        return [
                            {
                                label: "Weight for patient",
                                value: "Weight trail",
                                other: {
                                    labels, 
                                    values
                                }
                            }
                        ]
                    }
                },
                {
                    id: 'stage_4_conditions',
                    helpText: 'Stage 4 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    unload: (data: any) => this.stageFourObs = this.buildStagingData(data),
                    options: () => this.mapStagingOptions(
                        this.staging.isAdult() ? StagingCategory.ADULT_STAGE_4 : StagingCategory.PEDAID_STAGE_4 
                    )
                },
                {
                    id: 'stage_3_conditions',
                    helpText: 'Stage 3 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    unload: async (data: any) => this.stageThreeObs = this.buildStagingData(data),
                    options: () => this.mapStagingOptions(
                        this.staging.isAdult() ? StagingCategory.ADULT_STAGE_3 : StagingCategory.PEDAID_STAGE_3 
                    )
                },
                {
                    id: 'stage_2_conditions',
                    helpText: 'Stage 2 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    unload: async (data: any) => this.stageTwoObs = this.buildStagingData(data),
                    options: () => this.mapStagingOptions(
                        this.staging.isAdult() ? StagingCategory.ADULT_STAGE_2 : StagingCategory.PEDAID_STAGE_2 
                    )
                },
                {
                    id: 'stage_1_conditions',
                    helpText: 'Stage 1 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    unload: async (data: any) => this.stageOneObs = this.buildStagingData(data),
                    options: () => this.mapStagingOptions(
                        this.staging.isAdult() ? StagingCategory.ADULT_STAGE_1 : StagingCategory.PEDAID_STAGE_1 
                    )
                },
                {
                    id: 'cd4_available',
                    helpText: 'Recent CD4 count results available?',
                    type: FieldType.TT_SELECT,
                    unload: async (d: any) => this.cd4Available = d.value === 'Yes',
                    validation: (val: any) => Validation.required(val),
                    options: () => this.getYesNoOptions()
                },
                {
                    id: 'cd4_count',
                    helpText: 'CD4 Count',
                    type: FieldType.TT_NUMBER,
                    condition: (f: any) => this.hasCd4Count(f),
                    unload: (d: Option) => {
                        this.cd4Count = [this.staging.buildValueNumber('CD4 count', d.value)]
                    },
                    validation: (val: any) => Validation.required(val) || Validation.isNumber(val)
                },
                {
                    id: 'year',
                    helpText: 'Year of CD4 result',
                    type: FieldType.TT_NUMBER,
                    appearInSummary: false,
                    condition: (f: any) => this.hasCd4Count(f),
                    unload: (d: Option) => this.year = `${d.value}`,
                    validation(val: any) {
                        const minYr = HisDate.getYearFromAge(100)
                        const maxYr = HisDate.getCurrentYear()
                        const notNum = Validation.isNumber(val)
                        const noYear = Validation.required(val)
                        const notInRange = Validation.rangeOf(val, minYr, maxYr)
                        return noYear || notNum || notInRange
                    }
                },
                {
                    id: 'month',
                    helpText: 'Month of CD4 result',
                    type: FieldType.TT_SELECT,
                    appearInSummary: false,
                    options: () => MonthOptions,
                    unload: (d: Option) => this.month = `${d.value}`,
                    condition: (f: any) => this.hasCd4Count(f),
                    validation: (val: any) => {
                        const date = `${this.year}-${this.month}-01`
                        const notValid = HisDate.dateIsAfter(date) ? null : ['Month is greater than current month']
                        const noMonth = Validation.required(val)
                        return noMonth || notValid
                    }
                },
                {
                    id: 'day',
                    helpText: 'Day of CD4 result',
                    type: FieldType.TT_MONTHLY_DAYS,
                    summaryMapValue: () => ({ 
                        label: 'CD4 Results date',
                        value: HisDate.toStandardHisDisplayFormat(this.cd4DateStr) 
                    }),
                    condition: (f: any) => this.hasCd4Count(f),
                    unload: (d: Option) => {
                        this.cd4DateStr = `${this.year}-${this.month}-${d.value}`
                        this.cd4Date = [
                            this.staging.buildValueDate(
                                'Cd4 count datetime', this.cd4DateStr
                            )
                        ]
                    },
                    validation: (val: any) => {
                        const day = val.value
                        const date = `${this.year}-${this.month}-${day}`
                        const notValid = HisDate.dateIsAfter(date) ? null : ['Date is greater than current date']
                        const noDay = Validation.required(val)
                        return noDay || notValid
                    }
                },
                {
                    id: 'location',
                    helpText: 'CD4 Location',
                    type: FieldType.TT_SELECT,
                    group: 'person',
                    unload: (d: Option) => {
                        this.cd4Location = [this.staging.buildValueText('Cd4 count location', d.label)]
                    },
                    validation: (val: any) => Validation.required(val),
                    condition: (f: any) => this.hasCd4Count(f),
                    options: (_, filter='') => this.getFacilities(filter),
                    config: {
                        showKeyboard: true,
                        isFilterDataViaApi: true
                    }
                }
            ]
        }
    }
})
</script>

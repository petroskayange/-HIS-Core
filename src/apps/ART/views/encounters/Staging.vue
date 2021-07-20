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
import { isEmpty } from "lodash"
import { CD4_COUNT_PAD_LO } from "@/components/Keyboard/KbLayouts.ts"
export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        staging: {} as any,
        whoReasonsForArtObs: [] as any,
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
            const encounter = await this.staging.createEncounter()

            if (!encounter) return toastWarning('Unable to create encounter')
            
            const data = await Promise.all([
                ...this.pregnancyObs, ... this.stageFourObs, 
                ...this.stageThreeObs, ...this.stageTwoObs, 
                ...this.stageOneObs, ...this.cd4Count,
                ...this.cd4Date, ...this.cd4Location,
                ...this.whoReasonsForArtObs
            ])

            const obs = await this.staging.saveObservationList(data)

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
        setArtStagingReasonObs(stage: number) {
            const category = this.staging.getStagingCategoryByNum(stage)
            const reason = this.staging.getWhoReasonForART(category)

            this.whoReasonsForArtObs = [this.staging.buildValueCoded(
                "Reason for ART eligibility", reason
            )]
        },
        buildStagingData(data: Array<Option>) {
            return data.map((item: Option) => {
                return this.staging.buildValueCoded('Who stages criteria present', item.label)
            })
        },
        getStagingOptions(stage: number) {
            const group: StagingCategory = this.staging.getStagingCategoryByNum(stage)
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
                    validation: (val: any) => Validation.anyEmpty(val),
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
                    },
                    config: {
                        hiddenFooterBtns: [
                            'Clear'
                        ]
                    }
                },
                {
                    id: 'stage_4_conditions',
                    helpText: 'Stage 4 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    unload: (data: any) => {
                        this.stageFourObs = this.buildStagingData(data)
                        if (!isEmpty(this.stageFourObs)) this.setArtStagingReasonObs(4)
                    },
                    options: () => this.getStagingOptions(4)
                },
                {
                    id: 'stage_3_conditions',
                    helpText: 'Stage 3 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    unload: async (data: any) => {
                        this.stageThreeObs = this.buildStagingData(data)
                        // prioritize stage 4 reason if stage 4 conditions are set
                        if (!isEmpty(this.stageThreeObs) && isEmpty(this.stageFourObs)) 
                            this.setArtStagingReasonObs(3)
                    },
                    options: () => this.getStagingOptions(3)
                },
                {
                    id: 'stage_2_conditions',
                    helpText: 'Stage 2 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    unload: async (data: any) => {
                        this.stageTwoObs = this.buildStagingData(data)
                        // prioritize stage 3 and 4 reason if stage 3 and 4 conditions are set
                        if (!isEmpty(this.stageTwoObs) && isEmpty([
                            ...this.stageFourObs, ...this.stageThreeObs
                            ])) 
                            this.setArtStagingReasonObs(2)
                    },
                    options: () => this.getStagingOptions(2)
                },
                {
                    id: 'stage_1_conditions',
                    helpText: 'Stage 1 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    validation: (val: any) => {
                        const stages = [
                            ...this.stageFourObs,
                            ...this.stageThreeObs,
                            ...this.stageTwoObs
                        ]
                        if (isEmpty(val) && isEmpty(stages))
                            return ['Please provide atleast one staging condition']
                    },
                    unload: async (data: any) => {
                        this.stageOneObs = this.buildStagingData(data)
                        // prioritize higher staging reasons if other conditions are set
                        if (!isEmpty(this.stageOneObs) && isEmpty([
                            ...this.stageFourObs, ...this.stageThreeObs,
                            ...this.stageTwoObs
                        ]))
                            this.setArtStagingReasonObs(1)
                    },
                    options: () => this.getStagingOptions(1)
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
                    type: FieldType.TT_TEXT,
                    condition: (f: any) => this.hasCd4Count(f),
                    unload: (val: Option) => {
                        const value = val.value.toString()
                        const modifier = value.charAt(0)
                        const count = value.substring(1)
                        this.cd4Count = [this.staging.buildValueNumber('CD4 count', parseInt(count), modifier)]
                    },
                    validation: (val: any) => {
                        if (!val) return ['Value is required']

                        const {value} = val

                        if (value != 'Unknown' && !this.staging.cd4CountIsValid(value)) 
                            return ['Pleas start with either modifier first: >, <, or =']
                    },
                    config: {
                        customKeyboard: [
                            CD4_COUNT_PAD_LO,
                            [
                                ['Unknown', 'Delete']
                            ]
                        ]
                    }
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

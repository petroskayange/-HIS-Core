<template>
    <his-standard-form :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { StagingService } from "@/apps/ART/services/staging_service"
import EncounterMixinVue from './EncounterMixin.vue'
import Validation from "@/components/Forms/validations/StandardValidations"
import MonthOptions from "@/components/FormElements/Presets/MonthOptions"
import HisDate from "@/utils/Date"
import { isEmpty } from "lodash"
import { CD4_COUNT_PAD_LO } from "@/components/Keyboard/KbLayouts.ts"
import { matchToGuidelines } from "@/utils/GuidelineEngine"

export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        staging: {} as any,
        pregnancy: [] as any,
        stageFour: [] as any,
        stageThree: [] as any,
        stageTwo: [] as any,
        stageOne: [] as any,
        cd4Count: [] as any,
        cd4Available: false as boolean,
        cd4Date: [] as any,
        cd4Location: [] as any,
        cd4DateStr: '' as string,
        month: '' as string,
        year: '' as string,
        facts: {
            age: -1 as number,
            bmi: -1 as number,
            gender: '' as 'M' | 'F',
            stage: -1 as number,
            cd4: -1 as number,
            date: '' as string,
            "reason_for_art": '' as string,
            "test_type": '' as string,
            "pregnant": '' as 'Yes' | 'No',
            "breast_feeding": '' as 'Yes' | 'No',
            "selected_condition": '' as string,
            "selected_conditions": [] as Array<string>,
            "weight_percentile": -1 as number,
            "age_in_months": -1 as number,
            "cd4_modifier": ''
        }
    }),
    watch: {
        patient: {
            async handler(patient: any){
                if (patient) {

                    this.staging = new StagingService(patient.getID(), patient.getAge())

                    await this.initFacts(patient)

                    this.fields = this.getFields()
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async initFacts(patient: any) {
            await this.staging.loadHivConfirmatoryTestType()
            this.facts.age = patient.getAge()
            this.facts.bmi = await patient.getBMI()
            this.facts.date = StagingService.getSessionDate()
            this.facts.gender = patient.getGender()
            this.facts['test_type'] = this.staging.getConfirmatoryTestType()
            this.facts['age_in_months'] = patient.getAgeInMonths()

            if (this.staging.isPedaid()) {
                this.facts['weight_percentile'] = await this.patient.calculateWeightPercentile()
            }
        },
        async onSubmit() {
            const encounter = await this.staging.createEncounter()

            if (!encounter) return toastWarning('Unable to create encounter')

            const stagingConditions = this.buildStagingObs()
            const reasonForArt = this.buildReasonForArtObs() // must always come before who stage
            const whoStage = this.buildWhoStageObs()
            const data = await Promise.all([
                ...this.pregnancy, 
                ...stagingConditions, 
                ...this.cd4Count,
                ...this.cd4Date, 
                ...this.cd4Location,
                ...reasonForArt,
                ...whoStage
            ])

            const obs = await this.staging.saveObservationList(data)

            if (!obs) return toastWarning('Unable to save patient observations')

            toastSuccess('Observations and encounter created!')

            this.nextTask()
        },
        async onStagingCondition({ label }: Option) {
            this.facts['selected_condition'] = label
 
            const guidelines =  this.staging.getAlertGuidelines()
            const findings = matchToGuidelines(this.facts, guidelines)

            if (isEmpty(findings)) 
                return true

            if (findings[0]?.actions && findings[0]?.actions.alert) {
                const ok = await findings[0]?.actions.alert()
                return ok ? true : false
            }
            return true
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
                label: facility.name, value: facility.location_id
            }))
        },
        updatePregnancy(data: Array<Option>) {      
            this.pregnancy = data.map((data: Option) => {
                const  { value, other } = data

                const factID: 'pregnant' | 'breast_feeding' = other.factID
                this.facts[factID] = value.toString().match(/Yes/i) ? 'Yes' : 'No'
 
                return this.staging.buildValueCoded(other.concept, other.value)
            })
        },
        updateCd4Count(count: number, modifier: string) {
           this.cd4Count = [
               this.staging.buildValueNumber('CD4 count', count, modifier)
           ]
           this.facts.cd4 = count
           this.facts['cd4_modifier'] = modifier
        },
        updateCd4Date(date: string) {
            this.cd4Date = [ 
                this.staging.buildValueDate('Cd4 count datetime', date)
            ]
        },
        updateCd4Location(location: string) {
            this.cd4Location = [
                this.staging.buildValueText('Cd4 count location', location)
            ]
        },
        updateStageFour(data: Array<Option>) {
            this.stageFour = data.map(i => i.label)
            this.updateStagingFacts(4, data)
        },
        updateStageThree(data: Array<Option>) {
            this.stageThree = data.map(i => i.label)
            this.updateStagingFacts(3, data)
        },
        updateStageTwo(data: Array<Option>) {
            this.stageTwo = data.map(i => i.label)
            this.updateStagingFacts(2, data)
        },
        updateStageOne(data: Array<Option>) {
            this.stageOne = data.map(i => i.label)
            this.updateStagingFacts(1, data)
        },
        updateStagingFacts(stage: number, data: any) {
            const activeStage = this.facts.stage === null ? 0 : this.facts.stage
            
            if (stage >= activeStage && !isEmpty(data)) 
                this.facts.stage = stage

            this.facts['selected_conditions'] = [
                ...this.stageFour, 
                ...this.stageThree,
                ...this.stageTwo,
                ...this.stageOne
            ]
        },
        buildStagingObs() {
            return this.facts["selected_conditions"].map(item => this.staging.buildWhoCriteriaObs(item))
        },
        buildReasonForArtObs() {
            const guidelines = this.staging.getProgramEligibilityGuidelines()
            const recommendedReasons = matchToGuidelines(this.facts, guidelines)
            const reason = recommendedReasons[0].concept
            this.facts['reason_for_art'] = reason || ''

            return [this.staging.buildReasonForArtObs(reason)]
        },
        buildWhoStageObs() {
            const guidelines = this.staging.getWhoStageGuidelines()
            const findings = matchToGuidelines(this.facts, guidelines)
            return [this.staging.buildWhoStageObs(findings[0].concept)]
        },
        buildStagingOptions(stage: number) {
            const facts = {...this.facts}
            facts.stage = stage
            const guidelines = this.staging.getRecommendedConditionGuidelines()
            const findings = matchToGuidelines(this.facts, guidelines)

            return this.staging.getStagingConditions(stage).map((concept: any) => {
                let isChecked = false
                let disabled = false
                let description: unknown

                const conceptFindings = findings.filter(i => i.concept === concept.name)

                if (!isEmpty(conceptFindings)) {
                    const conceptFinding = conceptFindings[0] //get the first item only
                    isChecked = conceptFinding?.actions?.isChecked ? true : false
                    disabled = conceptFinding?.actions?.disabled ? true : false 

                    if (conceptFinding.description) 
                        description = conceptFinding.description
                }

                return {
                    label: concept.name,
                    value: concept.concept_id,
                    isChecked,
                    disabled,
                    description
                }
            })
        },
        hasCd4Count(f: any) {
            return f.cd4_available && f.cd4_available.label === 'Yes'
        },
        asymptomatic(f: any) {
            if (f) {
                const asymptomatics = f.filter((i: Option) => i.label.match(/asymptomatic/i) && i.isChecked)
                return !isEmpty(asymptomatics)
            }
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'pregnancy_status',
                    helpText: 'Pregnant / Breastfeeding',
                    type: FieldType.TT_MULTIPLE_YES_NO,
                    validation: (v: any) => Validation.anyEmpty(v),
                    condition: () => this.patient.isFemale(),
                    summaryMapValue: (d: Option) => ({ label: d.label, value: d.value }),
                    unload: async (data: any) => this.updatePregnancy(data),
                    options: () => [
                        {
                            label: 'Pregnant?',
                            value: '',
                            other: {
                                values: this.getYesNoOptions(),
                                concept: 'Is patient pregnant',
                                factID: 'pregnant'
                            }
                        },
                        {
                            label: 'Breastfeeding?',
                            value: '',
                            other: {
                                values: this.getYesNoOptions(),
                                concept: 'Is patient breast feeding',
                                factID: 'breast_feeding'
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
                    condition: (f: any) => !this.asymptomatic(f.stage_1_conditions),
                    appearInSummary: (f: any) => !this.asymptomatic(f.stage_1_conditions), 
                    unload: (data: any) => this.updateStageFour(data),
                    options: () => this.buildStagingOptions(4),
                    onValue: (v: Option) => this.onStagingCondition(v)
                },
                {
                    id: 'stage_3_conditions',
                    helpText: 'Stage 3 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    condition: (f: any) => !this.asymptomatic(f.stage_1_conditions),
                    appearInSummary: (f: any) => !this.asymptomatic(f.stage_1_conditions), 
                    unload: async (data: any) => this.updateStageThree(data),
                    options: () => this.buildStagingOptions(3),
                    onValue: (v: Option) => this.onStagingCondition(v)
                },
                {
                    id: 'stage_2_conditions',
                    helpText: 'Stage 2 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    condition: (f: any) => !this.asymptomatic(f.stage_1_conditions),
                    appearInSummary: (f: any) => !this.asymptomatic(f.stage_1_conditions),
                    unload: async (data: any) => this.updateStageTwo(data),
                    options: () => this.buildStagingOptions(2),
                    onValue: (v: Option) => this.onStagingCondition(v)
                },
                {
                    id: 'stage_1_conditions',
                    helpText: 'Stage 1 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    validation: (val: any) => {
                        if (isEmpty(val) && isEmpty(this.facts['selected_conditions']))
                            return ['Please provide atleast one staging condition']
                    },
                    unload: async (data: Array<Option>) => this.updateStageOne(data),
                    options: () => this.buildStagingOptions(1),
                    onValue: (v: Option) => this.onStagingCondition(v)
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
                        this.updateCd4Count(parseInt(count), modifier)
                        this.buildReasonForArtObs()
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
                    appearInSummary: () => false,
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
                    appearInSummary: () => false,
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
                        this.updateCd4Date(this.cd4DateStr)
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
                    unload: (d: Option) => this.updateCd4Location(d.label),
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

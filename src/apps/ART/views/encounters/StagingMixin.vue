<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { StagingService } from "@/apps/ART/services/staging_service"
import EncounterMixinVue from './EncounterMixin.vue'
import Validation from "@/components/Forms/validations/StandardValidations"
import MonthOptions from "@/components/FormElements/Presets/MonthOptions"
import HisDate from "@/utils/Date"
import { isEmpty } from "lodash"
import { CD4_COUNT_PAD_LO } from "@/components/Keyboard/KbLayouts"
import { matchToGuidelines } from "@/utils/GuidelineEngine"

export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        staging: {} as any,
        isShowStaging: true,
        showStagingWeightChart: true,
        pregnancy: [] as any,
        cd4Count: [] as any,
        cd4Available: false as boolean,
        cd4Date: [] as any,
        cd4Location: [] as any,
        cd4DateStr: '' as string,
        month: '' as string,
        year: '' as string,
        stagingFacts : {
            age: -1 as number,
            bmi: -1 as number,
            gender: '' as 'M' | 'F',
            stage: -1 as number,
            cd4: -1 as number,
            date: '' as string,
            stageOneConditions: [] as Array<string>,
            stageTwoConditions: [] as Array<string>,
            stageThreeConditions: [] as Array<string>,
            stageFourConditions: [] as Array<string>,
            reasonForArt: '' as string,
            testType: '' as string,
            pregnant: '' as 'Yes' | 'No',
            breastFeeding: '' as 'Yes' | 'No',
            selectedCondition: '' as string,
            selectedConditions: [] as Array<string>,
            weightPercentile: -1 as number,
            ageInMonths: -1 as number,
            cd4Modifier: '' as string,
            whoStage: '' as string
        }
    }),
    methods: {
        async initStaging(patient: any) {
            this.staging = new StagingService(patient.getID(), patient.getAge())

            await this.staging.loadHivConfirmatoryTestType()

            this.stagingFacts.age = patient.getAge()
            this.stagingFacts.bmi = await patient.getBMI()
            this.stagingFacts.date = StagingService.getSessionDate()
            this.stagingFacts.gender = patient.isMale() ? 'M' : 'F' 
            this.stagingFacts.testType = this.staging.getConfirmatoryTestType()
            this.stagingFacts.ageInMonths = patient.getAgeInMonths()

            if (this.staging.isPedaid()) {
                this.stagingFacts.weightPercentile = await patient.calculateWeightPercentile()
            }
        },
        async submitStaging() {
            const encounter = await this.staging.createEncounter()
            
            if (!encounter) throw 'Unable to create staging encounter'

            const stagingConditions = this.buildStagingObs()
            const reasonForArt = this.buildReasonForArtObs()
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

            if (!obs) throw 'Unable to save patient observations'
        },
        async onStagingCondition({ label }: Option) {
            this.stagingFacts.selectedCondition = label
 
            const guidelines =  this.staging.getAlertGuidelines()
            const findings = matchToGuidelines(this.stagingFacts, guidelines)

            if (isEmpty(findings)) 
                return true

            if (findings[0]?.actions && findings[0]?.actions.alert) {
                const ok = await findings[0]?.actions.alert(this.stagingFacts)
                return ok ? true : false
            }
            return true
        },
        onSummary(){
            this.setWhoStage()
            this.setReasonForArt()
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

                const factID: 'pregnant' | 'breastFeeding' = other.factID
                this.stagingFacts[factID] = value.toString().match(/Yes/i) ? 'Yes' : 'No'
 
                return this.staging.buildValueCoded(other.concept, value)
            })
        },
        updateCd4Count(count: number, modifier: string) {
           this.cd4Count = [
               this.staging.buildValueNumber('CD4 count', count, modifier)
           ]
           this.stagingFacts.cd4 = count
           this.stagingFacts.cd4Modifier = modifier
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
            this.stagingFacts.stageFourConditions = data.map(i => i.label)
            this.updateStagingFacts(4, data)
        },
        updateStageThree(data: Array<Option>) {
            this.stagingFacts.stageThreeConditions = data.map(i => i.label)
            this.updateStagingFacts(3, data)
        },
        updateStageTwo(data: Array<Option>) {
            this.stagingFacts.stageTwoConditions = data.map(i => i.label)
            this.updateStagingFacts(2, data)
        },
        updateStageOne(data: Array<Option>) {
            this.stagingFacts.stageOneConditions = data.map(i => i.label)
            this.updateStagingFacts(1, data)
        },
        updateStagingFacts(stage: number, data: any) {
            const activeStage = this.stagingFacts.stage === null ? 0 : this.stagingFacts.stage

            if (stage >= activeStage && !isEmpty(data))
                this.stagingFacts.stage = stage

            this.stagingFacts.selectedConditions= [
                ...this.stagingFacts.stageFourConditions, 
                ...this.stagingFacts.stageThreeConditions,
                ...this.stagingFacts.stageTwoConditions,
                ...this.stagingFacts.stageOneConditions
            ]
        },
        buildStagingObs() {
            return this.stagingFacts.selectedConditions.map(item => this.staging.buildWhoCriteriaObs(item))
        },
        buildReasonForArtObs() {
            return [this.staging.buildReasonForArtObs(this.stagingFacts.reasonForArt)]
        },
        buildWhoStageObs() {
            return [this.staging.buildWhoStageObs(this.stagingFacts.whoStage)]
        },
        buildStagingOptions(stage: number, previouslySelected=[] as Array<string>) {
            const guidelines = this.staging.getRecommendedConditionGuidelines()

            return this.staging.getStagingConditions(stage).map((concept: any) => {
                let disabled = false
                let description: unknown
                let isChecked = previouslySelected.includes(concept.name)
                this.stagingFacts.selectedCondition = concept.name

                const findings = matchToGuidelines(this.stagingFacts, guidelines)

                if (!isEmpty(findings)) {
                    const conceptFinding = findings[0] //get the first item only
                    if (conceptFinding?.actions?.isChecked) {
                        isChecked = true
                    }
                    if (conceptFinding?.actions?.disabled) {
                        disabled = true
                    }
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
        setWhoStage() {
            const guidelines = this.staging.getWhoStageGuidelines()
            const findings = matchToGuidelines(this.stagingFacts, guidelines)
            this.stagingFacts.whoStage = findings[0]?.concept || ''
        },
        setReasonForArt() {
            const guidelines = this.staging.getProgramEligibilityGuidelines()
            const findings = matchToGuidelines(this.stagingFacts, guidelines)
            this.stagingFacts.reasonForArt = findings[0]?.concept || ''
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
        summaryOptions() {
            return [
                { 
                    label: 'WHO Stage', 
                    value: this.stagingFacts.whoStage,
                    other: {
                        type: 'title-section'
                    }
                 },
                { 
                    label: 'Condition on starting ART', 
                    value: this.stagingFacts.reasonForArt,
                    other: {
                        type: 'title-section'
                    } 
                },
                ...this.stagingFacts.selectedConditions.map((i: string) => ({ label: i, value: i }))
            ]
        },
        getStagingSummaryField(helpText="Summary" as string) {
            return {
                id: 'summary',
                helpText,
                type: FieldType.TT_ART_STAGING_SUMMARY,
                condition: () => this.isShowStaging,
                onload: () => this.onSummary(),
                options: () => this.summaryOptions(),
                config: {
                    title: 'Selected stage defining conditions',
                    hiddenFooterBtns: [
                        'Clear'
                    ]
                }
            }
        },
        getStagingFields(): Array<Field> {
            return [
                {
                    id: 'pregnancy_status',
                    helpText: 'Pregnant / Breastfeeding',
                    type: FieldType.TT_MULTIPLE_YES_NO,
                    validation: (v: any) => Validation.anyEmpty(v),
                    condition: () => this.isShowStaging && this.patient.isFemale(),
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
                                factID: 'breastFeeding'
                            }
                        }
                    ]
                },
                {
                    id: 'patient_weight_chart',
                    helpText: 'Weight history',
                    type: FieldType.TT_WEIGHT_CHART,
                    condition: () => this.isShowStaging && this.showStagingWeightChart,
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
                    condition: (f: any) => this.isShowStaging && !this.asymptomatic(f.stage_1_conditions),
                    unload: (data: any) => this.updateStageFour(data),
                    options: () => this.buildStagingOptions(4, this.stagingFacts.stageFourConditions),
                    onValue: (v: Option) => this.onStagingCondition(v)
                },
                {
                    id: 'stage_3_conditions',
                    helpText: 'Stage 3 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    condition: (f: any) => this.isShowStaging && !this.asymptomatic(f.stage_1_conditions),
                    unload: async (data: any) => this.updateStageThree(data),
                    options: () => this.buildStagingOptions(3, this.stagingFacts.stageThreeConditions),
                    onValue: (v: Option) => this.onStagingCondition(v)
                },
                {
                    id: 'stage_2_conditions',
                    helpText: 'Stage 2 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    condition: (f: any) => this.isShowStaging && !this.asymptomatic(f.stage_1_conditions),
                    unload: async (data: any) => this.updateStageTwo(data),
                    options: () => this.buildStagingOptions(2, this.stagingFacts.stageTwoConditions),
                    onValue: (v: Option) => this.onStagingCondition(v)
                },
                {
                    id: 'stage_1_conditions',
                    helpText: 'Stage 1 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    condition: () => this.isShowStaging,
                    validation: (val: any) => {
                        if (isEmpty(val) && isEmpty(this.stagingFacts.selectedConditions))
                            return ['Please provide atleast one staging condition']
                    },
                    unload: async (data: Array<Option>) => this.updateStageOne(data),
                    options: () => this.buildStagingOptions(1, this.stagingFacts.stageOneConditions),
                    onValue: (v: Option) => this.onStagingCondition(v)
                },
                {
                    id: 'cd4_available',
                    helpText: 'Recent CD4 count results available?',
                    type: FieldType.TT_SELECT,
                    condition: () => this.isShowStaging,
                    unload: async (d: any) => this.cd4Available = d.value === 'Yes',
                    validation: (val: any) => Validation.required(val),
                    options: () => this.getYesNoOptions()
                },
                {
                    id: 'cd4_count',
                    helpText: 'CD4 Count',
                    type: FieldType.TT_TEXT,
                    condition: (f: any) => this.isShowStaging && this.hasCd4Count(f),
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
                    condition: (f: any) => this.isShowStaging && this.hasCd4Count(f),
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
                    options: () => MonthOptions,
                    unload: (d: Option) => this.month = `${d.value}`,
                    condition: (f: any) => this.isShowStaging && this.hasCd4Count(f),
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
                    condition: (f: any) => this.isShowStaging && this.hasCd4Count(f),
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
                    condition: (f: any) => this.isShowStaging && this.hasCd4Count(f),
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
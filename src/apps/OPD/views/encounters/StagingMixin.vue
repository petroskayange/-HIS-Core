<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { StagingService } from "@/apps/ART/services/staging_service"
import EncounterMixinVue from './EncounterMixin.vue'
import Validation from "@/components/Forms/validations/StandardValidations"
import { generateDateFields } from "@/utils/HisFormHelpers/MultiFieldDateHelper"
import HisDate from "@/utils/Date"
import { isEmpty } from "lodash"
import { CD4_COUNT_PAD_LO } from "@/components/Keyboard/KbLayouts"
import { matchToGuidelines } from "@/utils/GuidelineEngine"

export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        staging: {} as any,
        showStagingWeightChart: true,
        bmiObj: {} as any, 
        stagingFacts : {
            age: -1 as number,
            bmi: -1 as number,
            gender: '' as 'M' | 'F',
            stage: -1 as number,
            cd4: -1 as number,
            date: '' as string,
            isChildBearing: false as boolean,
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
            this.bmiObj = await patient.getBMI()
            this.stagingFacts.age = patient.getAge()
            this.stagingFacts.bmi = this.bmiObj['index']
            this.stagingFacts.date = StagingService.getSessionDate()
            this.stagingFacts.gender = patient.isMale() ? 'M' : 'F' 
            this.stagingFacts.testType = this.staging.getConfirmatoryTestType()
            this.stagingFacts.ageInMonths = patient.getAgeInMonths()
            this.stagingFacts.isChildBearing = patient.isChildBearing()

            if (this.staging.isPedaid()) {
                this.stagingFacts.weightPercentile = await patient.calculateWeightPercentile()
            }
        },
        async submitStaging(computedValues: any) {
            const encounter = await this.staging.createEncounter()

            if (!encounter) throw 'Unable to create staging encounter'

            const stagingObservations = await this.resolveObs(computedValues, 'staging')
            const derivedObservations = await Promise.all([
                this.buildReasonForArtObs(), this.buildWhoStageObs()
            ])

            const obs = await this.staging.saveObservationList([
                ...stagingObservations, ...derivedObservations
            ])

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
        async getFacilities(filter=''){
            const facilities = await this.staging.getFacilities(filter)
            return facilities.map((facility: any) => ({
                label: facility.name, value: facility.location_id
            }))
        },
        updateStagingFacts(stage: number, data: any) {
            const activeStage = this.stagingFacts.stage === null ? 0 : this.stagingFacts.stage

            if (stage >= activeStage && !isEmpty(data)) this.stagingFacts.stage = stage

            this.stagingFacts.selectedConditions= [
                ...this.stagingFacts.stageFourConditions, 
                ...this.stagingFacts.stageThreeConditions,
                ...this.stagingFacts.stageTwoConditions,
                ...this.stagingFacts.stageOneConditions
            ]
        },
        buildReasonForArtObs() {
            return this.staging.buildReasonForArtObs(this.stagingFacts.reasonForArt)
        },
        buildWhoStageObs() {
            return this.staging.buildWhoStageObs(this.stagingFacts.whoStage)
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
        notAsymptomatic(f: any) {
            const stageOneC = f.stage_1_conditions
            if (stageOneC) {
                const asymptomatics = stageOneC.filter((i: Option) => {
                    return i.label.match(/asymptomatic/i) && i.isChecked
                })
                return isEmpty(asymptomatics)
            }
            return true
        },
        hasStaging(f: Record<string, any>) {
            // For components that have Optional staging
            if ('has_transfer_letter' in f) {
                return f.has_transfer_letter && f.has_transfer_letter.value === 'Yes'
            }
            return true
        },
        yearNotHundredAgo(year: string) {
            const oldestYear = HisDate.getYearFromAge(100)
            return parseInt(year) < oldestYear ? ['Year is too long ago'] : null
        },
        dateBeforeBirthDate(date: string) {
            return date < this.patient.getBirthdate() ? ['Date is before Date of birth'] : null
        },
        dateInFuture(date: string) {
            return date > this.staging.getDate() ? ['Date is out of range'] : null
        },
        getStagingSummaryField(helpText="Summary" as string) {
            return {
                id: 'summary',
                helpText,
                type: FieldType.TT_ART_STAGING_SUMMARY,
                condition: (f: any) => this.hasStaging(f),
                onload: () => {
                    this.setWhoStage()
                    this.setReasonForArt()
                },
                options: () => [
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
                ],
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
                    summaryMapValue: (d: Option) => ({ 
                        label: d.label, 
                        value: d.value 
                    }),
                    computedValue: (data: Array<Option>) => ({
                        tag: 'staging',
                        obs: data.map((d: Option) => {
                            const  { value, other } = d

                            const factID: 'pregnant' | 'breastFeeding' = other.factID
                            this.stagingFacts[factID] = value.toString().match(/Yes/i) ? 'Yes' : 'No'

                            return this.staging.buildValueCoded(other.concept, value)
                        })
                    }),
                    options: () => ([
                        {
                            label: 'Pregnant?',
                            value: '',
                            other: {
                                values: this.yesNoOptions(),
                                concept: 'Is patient pregnant',
                                factID: 'pregnant'
                            }
                        },
                        {
                            label: 'Breastfeeding?',
                            value: '',
                            other: {
                                values: this.yesNoOptions(),
                                concept: 'Is patient breast feeding',
                                factID: 'breastFeeding'
                            }
                        }
                    ]),
                    condition: (f: any) => this.hasStaging(f) && this.stagingFacts.isChildBearing,
                },
                {
                    id: 'patient_weight_chart',
                    helpText: 'Weight history',
                    type: FieldType.TT_WEIGHT_CHART,
                    options: async () => {
                        let values = await this.patient.getWeightHistory()
                        values = values.map((d: any) => ({ 
                            x: HisDate.toStandardHisDisplayFormat(d.date), 
                            y: d.weight
                        }))
                        return [
                            {
                                label: "Weight for patient",
                                value: "Weight trail",
                                other: {
                                    values,
                                    age: this.patient.getAge(),
                                    bmi: this.bmiObj
                                }
                            }
                        ]
                    },
                    config: {
                        hiddenFooterBtns: [
                            'Clear'
                        ]
                    },
                    condition: (f: any) => this.hasStaging(f) && this.showStagingWeightChart
                },
                {
                    id: 'stage_4_conditions',
                    helpText: 'Stage 4 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    options: () => this.buildStagingOptions(4, this.stagingFacts.stageFourConditions),
                    onValue: (v: Option) => this.onStagingCondition(v),
                    computedValue: (d: Array<Option>) => {
                        const data = d.map(i => i.label)
                        this.stagingFacts.stageFourConditions = data
                        this.updateStagingFacts(4, d)
                        return {
                            tag: 'staging',
                            obs: data.map(i => this.staging.buildWhoCriteriaObs(i))
                        }
                    },
                    condition: (f: any) => this.hasStaging(f) && this.notAsymptomatic(f),
                },
                {
                    id: 'stage_3_conditions',
                    helpText: 'Stage 3 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    options: () => this.buildStagingOptions(3, this.stagingFacts.stageThreeConditions),
                    onValue: (v: Option) => this.onStagingCondition(v),
                    computedValue: (d: Array<Option>) => {
                        const data = d.map(i => i.label)
                        this.stagingFacts.stageThreeConditions = data
                        this.updateStagingFacts(3, d)
                        return {
                            tag: 'staging',
                            obs: data.map(i => this.staging.buildWhoCriteriaObs(i))
                        }
                    },
                    condition: (f: any) => this.hasStaging(f) && this.notAsymptomatic(f),
                },
                {
                    id: 'stage_2_conditions',
                    helpText: 'Stage 2 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    options: () => this.buildStagingOptions(2, this.stagingFacts.stageTwoConditions),
                    onValue: (v: Option) => this.onStagingCondition(v),
                    computedValue: (d: Array<Option>) => {
                        const data = d.map(i => i.label)
                        this.stagingFacts.stageTwoConditions = data
                        this.updateStagingFacts(2, d)
                        return {
                            tag: 'staging',
                            obs: data.map(i => this.staging.buildWhoCriteriaObs(i))
                        }
                    },
                    condition: (f: any) => this.hasStaging(f) && this.notAsymptomatic(f),
                },
                {
                    id: 'stage_1_conditions',
                    helpText: 'Stage 1 conditions',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    validation: (val: any) => {
                        if (isEmpty(val) && isEmpty(this.stagingFacts.selectedConditions))
                            return ['Please provide atleast one staging condition']
                    },
                    options: () => this.buildStagingOptions(1, this.stagingFacts.stageOneConditions),
                    onValue: (v: Option) => this.onStagingCondition(v),
                    computedValue: (d: Array<Option>) => {
                        const data = d.map(i => i.label)
                        this.stagingFacts.stageOneConditions = data
                        this.updateStagingFacts(1, d)
                        return {
                            tag: 'staging',
                            obs: data.map(i => this.staging.buildWhoCriteriaObs(i))
                        }
                    },
                    condition: (f: any) => this.hasStaging(f),
                },
                {
                    id: 'cd4_available',
                    helpText: 'Recent CD4 count results available?',
                    type: FieldType.TT_SELECT,
                    condition: (f: any) => this.hasStaging(f),
                    validation: (val: any) => Validation.required(val),
                    options: () => this.yesNoOptions()
                },
                {
                    id: 'cd4_count',
                    helpText: 'CD4 Count',
                    type: FieldType.TT_TEXT,
                    computedValue: (d: Option) => {
                        const value = d.value.toString()
                        const modifier = value.charAt(0)
                        const count = parseInt(value.substring(1))

                        this.stagingFacts.cd4 = count
                        this.stagingFacts.cd4Modifier = modifier

                        return {
                            tag: 'staging',
                            obs: this.staging.buildValueNumber(
                                'CD4 count', count, modifier
                            )
                        }
                    },
                    validation: (val: any) => {
                        const isCd4 = () => this.staging.cd4CountIsValid(val.value)
                        return this.validateSeries([
                            () => Validation.required(val),
                            () => !isCd4() ? ['Please start with either modifier first: >, <, or ='] : null
                        ])
                    },
                    config: {
                        customKeyboard: [
                            CD4_COUNT_PAD_LO,
                            [
                                ['Unknown', 'Delete']
                            ]
                        ]
                    },
                    condition: (f: any) => this.hasStaging(f) && f.cd4_available.value === 'Yes',
                },
                ...generateDateFields({
                    id: 'cd4_result_date',
                    helpText: 'Cd4 Results',
                    condition: (f: any) =>  this.hasStaging(f) && f.cd4_available.value === 'Yes',
                    validation: (val: any) => {
                        return this.validateSeries([
                            () => Validation.required(val),
                            () => this.dateBeforeBirthDate(val.value),
                            () => this.dateInFuture(val.value)
                        ])
                    },
                    computeValue: (date: string, isEstimate: boolean) => {
                        return {
                            date,
                            tag: 'staging',
                            isEstimate,
                            obs: this.staging.buildValueDate('Cd4 count datetime', date) 
                        }
                    }
                }, this.staging.getDate()),
                {
                    id: 'location',
                    helpText: 'CD4 Location',
                    type: FieldType.TT_SELECT,
                    computedValue: ({ label }: Option) => ({
                        tag: 'staging',
                        obs: this.staging.buildValueText('Cd4 count location', label)
                    }),
                    validation: (val: any) => Validation.required(val),
                    options: (_, filter='') => this.getFacilities(filter),
                    config: {
                        showKeyboard: true,
                        isFilterDataViaApi: true
                    },
                    condition: (f: any) => this.hasStaging(f) && f.cd4_available.value === 'Yes',
                }
            ]
        }
    }
})
</script>

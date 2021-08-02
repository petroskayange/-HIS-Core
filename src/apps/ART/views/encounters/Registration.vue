<template>
    <his-standard-form :skipSummary="isShowStaging" :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Option } from "@/components/Forms/FieldInterface"
import MonthOptions from "@/components/FormElements/Presets/MonthOptions"
import Validation from "@/components/Forms/validations/StandardValidations"
import StagingMixin from "@/apps/ART/views/encounters/StagingMixin.vue"
import {ClinicRegistrationService} from "@/apps/ART/services/registration_service"
import { CD4_COUNT_PAD_LO } from "@/components/Keyboard/KbLayouts"
import { toastWarning, toastSuccess} from "@/utils/Alerts"
import { VitalsService } from "@/apps/ART/services/vitals_service";
import { BMIService } from "@/services/bmi_service"
import HisDate from "@/utils/Date"

export default defineComponent({
    mixins: [StagingMixin],
    data: () => ({
        registration: {} as any,
        vitals: {} as any
    }),
    watch: {
        patient: {
            async handler(patient: any){
                if (!patient) return

                this.registration = new ClinicRegistrationService(patient.getID())
                this.vitals = new VitalsService(patient.getID())
                await this.initStaging(this.patient)

                this.isShowStaging = false
                this.showStagingWeightChart = false
                this.fields = this.getRegistrationFields()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async onSubmit(f: any, computedData: any) {
            const fObs = {...computedData}
            const encounter = await this.registration.createEncounter()

            if (!encounter) return toastWarning('Unable to create registration encounter')

            try {
                if (this.isShowStaging) {
                    await this.submitStaging()
                    await this.vitals.createEncounter()

                    const vitalsObs = await this.resolveObs(fObs, 'vitals')
                    await this.vitals.saveObservationList(vitalsObs)
                } 
            } catch(e) {
                return toastWarning(e)
            }
            const registrationData = await this.resolveObs(fObs, 'reg')
            const registrationObs = await this.registration.saveObservationList(registrationData)

            if (!registrationObs) return toastWarning('Unable to save observations')

            toastSuccess('Clinic registration complete!')

            this.nextTask()
        },
        resolveObs(obs: any, tag='') {
            let values: Array<any> = []
            Object.values(obs)
                  .filter((d: any) => d.tag === tag || tag === '')
                  .forEach((data: any) => {
                    if (Array.isArray(data.obs)) {
                        values = [...values, ...data.obs]
                    } else {
                        values.push(data.obs)
                    }
                })
            return Promise.all(values)
        },
        yearNotHundredAgo(year: string) {
            const oldestYear = HisDate.getYearFromAge(100)
            return parseInt(year) < oldestYear ? ['Year is too long ago'] : null
        },
        dateBeforeBirthDate(date: string) {
            return date < this.patient.getBirthdate() ? ['Date is before Date of birth'] : null
        },
        dateInFuture(date: string) {
            return date > this.registration.getDate() ? ['Date is out of range'] : null
        },
        validateSeries(conditions: Array<any>){
            for(const i in conditions) {
                const condition = conditions[i]

                if (condition) return condition
            }
        },
        getRegistrationFields() {
            return [
                {
                    id: 'followup_agreement',
                    helpText: 'Agrees to follow-up',
                    type: FieldType.TT_MULTIPLE_YES_NO,
                    summaryMapValue: ({value, label}: Option) => ({
                        label: `${label} followup`, value: value
                    }),
                    validation: (v: any) => Validation.anyEmpty(v),
                    computedValue: (d: Array<Option>) => {
                        const obs: any = []
                        d.forEach(({ label, value }: Option) => {
                            obs.push(this.registration.buildValueCoded('Agrees to followup', label))
                            obs.push(this.registration.buildValueCoded(label, value))
                        })
                        return { tag:'reg', obs }
                    },
                    options: () => ([
                        {
                            label: 'Phone',
                            value: '',
                            other: {
                                values: this.getYesNoOptions(),
                            }
                        },
                        {
                            label: 'Home visit',
                            value: '',
                            other: {
                                values: this.getYesNoOptions()
                            }
                        }
                    ])
                },
                {
                    id: 'received_arvs',
                    helpText: 'Ever received ARVs for treatment or prophylaxis?',
                    type: FieldType.TT_SELECT,
                    computedValue: ({value}: Option) => ({
                        tag:'reg',
                        obs: this.registration.buildValueCoded(
                            'Ever registered at ART clinic', value
                        )
                    }),
                    validation: (v: any) => Validation.required(v),
                    options: () => this.getYesNoOptions()
                },
                {
                    id: 'year_last_taken_arvs',
                    helpText: 'Year last taken ARVs',
                    type: FieldType.TT_NUMBER,
                    appearInSummary: () => false,
                    condition: (f: any) => f.received_arvs.value === 'Yes',
                    validation: (val: any) => {
                        const date = HisDate.stitchDate(val.value)
                        if (val.value != 'Unknown') {
                            return this.validateSeries([
                                Validation.required(val),
                                Validation.isNumber(val),
                                this.yearNotHundredAgo(val.value),
                                this.dateBeforeBirthDate(date),
                                this.dateInFuture(date)
                            ])
                        }
                        return null
                    }
                },
                {
                    id: 'month_last_taken_arvs',
                    helpText: 'Month last taken ARVs',
                    type: FieldType.TT_SELECT,
                    appearInSummary: () => false,
                    options: () => MonthOptions,
                    condition: (f: any) => f.year_last_taken_arvs.value != 'Unknown',
                    validation: (val: any, f: any) => {
                        if (val.value != 'Unknown') {
                            const date = HisDate.stitchDate(f.year_last_taken_arvs.value, val.value)
                            return this.validateSeries([
                                Validation.required(val),
                                this.dateBeforeBirthDate(date),
                                this.dateInFuture(date)
                            ])
                        }
                        return null
                    } 
                },
                {
                    id: 'day_last_taken_arvs',
                    helpText: 'Day last taken ARVs',
                    type: FieldType.TT_MONTHLY_DAYS,
                    summaryMapValue: (d: Option, f: any, computedValue: any) => ({
                        label: 'Date last taken Arvs', value : computedValue.date
                    }),
                    validation: (val: any, f: any, { date }: any) => {
                        return this.validateSeries([
                            Validation.required(val),
                            Validation.isNumber(val),
                            this.dateBeforeBirthDate(date),
                            this.dateInFuture(date)
                        ])
                    },
                    computedValue: ({value}: Option, f: any) => {
                        const date = HisDate.stitchDate(
                            f.year_last_taken_arvs.value,
                            f.month_last_taken_arvs.value,
                            value
                        )
                        return {
                            tag:'reg', 
                            date,
                            obs: this.registration.buildValueDate('Date ART last taken', date) 
                        }
                    },
                    condition: (f: any) => f.month_last_taken_arvs.value,
                },
                {
                    id: 'taken_art_in_last_two_months',
                    helpText: 'Taken ARVs in the last two months?',
                    type: FieldType.TT_SELECT,
                    validation: (v: any) => Validation.required(v),
                    computedValue: ({value}: Option) => ({
                        tag:'reg',
                        obs: this.registration.buildValueCoded(
                            'Has the patient taken ART in the last two months', value
                        )
                    }),
                    condition: (f: any) => f.year_last_taken_arvs.value === 'Unknown',
                    options: () => [...this.getYesNoOptions(), { label: 'Unknown', value: 'Unknown' }]
                },
                {
                    id: 'taken_art_in_last_two_weeks',
                    helpText: 'Ever received ARVs for treatment or prophylaxis?',
                    type: FieldType.TT_SELECT,
                    computedValue: ({value}: Option) => ({
                        tag:'reg',
                        obs: this.registration.buildValueCoded(
                            'Has the patient taken ART in the last two weeks', value
                        ) 
                    }),
                    validation: (v: any) => Validation.required(v),
                    condition: (f: any) => f.taken_art_in_last_two_months.value === 'Yes',
                    options: () => [...this.getYesNoOptions(), { label: 'Unknown', value: 'Unknown' }]
                },
                {
                    id: 'ever_registered_at_art_clinic',
                    helpText: 'Ever registered at an ART clinic?',
                    type: FieldType.TT_SELECT,
                    computedValue: ({ value }: Option) => ({
                        tag:'reg',
                        obs: this.registration.buildValueCoded(
                            'Ever registered at ART clinic', value
                        )
                    }),
                    validation: (v: any) => Validation.required(v),
                    condition: (f: any) => f.received_arvs.value === 'Yes',
                    options: () => this.getYesNoOptions()
                },
                {
                    id: 'location_of_art_initialization',
                    helpText: 'Location of ART initiation',
                    type: FieldType.TT_SELECT,
                    computedValue: ({label}: Option) => ({
                        tag:'reg',
                        obs: this.registration.buildValueText(
                            'Location of ART initiation', label
                        )
                    }),
                    validation: (val: any) => Validation.required(val),
                    condition: (f: any) => f.ever_registered_at_art_clinic.value === 'Yes',
                    options: (_: any, filter='') => this.getFacilities(filter),
                    config: {
                        showKeyboard: true,
                        isFilterDataViaApi: true
                    }
                },
                {
                    id: 'year_started_art',
                    helpText: 'Year started ART',
                    type: FieldType.TT_NUMBER,
                    appearInSummary: () => false,
                    condition: (f: any) => f.ever_registered_at_art_clinic.value === 'Yes',
                    validation: (val: any) => {
                        if (val.value != 'Unknown') {
                            const date = HisDate.stitchDate(val.value)
                            return this.validateSeries([
                                Validation.required(val),
                                Validation.isNumber(val),
                                this.yearNotHundredAgo(val.value),
                                this.dateBeforeBirthDate(date),
                                this.dateInFuture(date)
                            ])
                        }
                        return null
                    }
                },
                {
                    id: 'month_started_art',
                    helpText: 'Month last taken ARVs',
                    type: FieldType.TT_SELECT,
                    appearInSummary: () => false,
                    options: () => MonthOptions,
                    condition: (f: any) => f.year_started_art.value != 'Unknown',
                    validation: (val: any, f: any) => {
                        if (val.value != 'Unknown') {
                            const date = HisDate.stitchDate(f.year_started_art.value, val.value)
                            return this.validateSeries([
                                Validation.required(val),
                                this.dateBeforeBirthDate(date),
                                this.dateInFuture(date)
                            ])
                        }
                        return null
                    }
                },
                {
                    id: 'day_started_art',
                    helpText: 'Day started ART',
                    type: FieldType.TT_MONTHLY_DAYS,
                    summaryMapValue: (_: Option, f: any, computedValue: any) => ({
                        label: 'Date started Art', value: computedValue.date
                    }),
                    computedValue: ({value}: Option, f: any) => {
                        const date = HisDate.stitchDate(
                            f.year_started_art.value,
                            f.month_started_art.value,
                            value
                        )
                        this.staging.setDate(date)
                        this.vitals.setDate(date)
                        return {
                            tag:'reg', date,
                            obs: this.registration.buildValueDate('Drug start date', date)
                        }
                    },
                    condition: (f: any) => f.month_started_art.value != 'Unknown',
                    validation: (val: any, f: any, { date }: any) => {
                        return this.validateSeries([
                            Validation.required(val),
                            Validation.isNumber(val),
                            this.dateBeforeBirthDate(date),
                            this.dateInFuture(date)
                        ])
                    },
                },
                {
                    id: 'art_start_date_estimation',
                    helpText: 'Estimated time since ART initiation',
                    type: FieldType.TT_SELECT,
                    validation: (val: any) => Validation.required(val),
                    condition: (f: any) => f.year_started_art.value === "Unknown",
                    computedValue: ({value}: Option) => {
                        const date = new Date()
                        date.setDate(date.getDate() - parseInt(value.toString()))
                        const hisDate = HisDate.toStandardHisFormat(date)

                        this.staging.setDate(hisDate)
                        this.vitals.setDate(hisDate)

                        return {
                            tag:'reg',
                            date: hisDate,
                            obs: this.registration.buildValueDate('Drug start date', hisDate)
                        }
                    },
                    options: () => ([
                        { label: '6 months', value: 180 },
                        { label: '12 months', value: 365 },
                        { label: '18 months', value: 540 },
                        { label: '24 months', value: 730 },
                        { label: 'Over 2 years', value: 730 }
                    ]),
                },
                {
                    id: 'previous_art_number',
                    helpText: 'ART number at previous location',
                    type: FieldType.TT_TEXT,
                    condition: (f: any) => f.ever_registered_at_art_clinic.value === 'Yes',
                    computedValue: (d: Option) => ({
                        tag:'reg',
                        obs: this.registration.buildValueText(
                            'ART number at previous location', d.value
                        )
                    }),
                    validation: (val: Option) => Validation.required(val)
                },
                {
                    id: 'has_transfer_letter',
                    helpText: 'Has staging information?',
                    type: FieldType.TT_SELECT,
                    validation: (v: any) => Validation.required(v),
                    computedValue: ({ value }: Option) => ({
                        tag:'reg',
                        obs: this.registration.buildValueCoded(
                            'Has transfer letter', value
                        )
                    }),
                    unload: ({value}: any) => this.isShowStaging = value === 'Yes',
                    condition: (f: any) => f.ever_registered_at_art_clinic.value === 'Yes',
                    options: () => this.getYesNoOptions()
                },
                {
                    id: 'height',
                    helpText: 'Height (CM)',
                    type: FieldType.TT_NUMBER,
                    condition: (f: any) => f.has_transfer_letter.value === 'Yes',
                    computedValue: ({ value }: Option) => ({
                        tag:'vitals',
                        obs: this.vitals.buildValueNumber('Height', value)
                    }),
                    validation: (val: any) => this.validateSeries([
                        Validation.required(val),
                        Validation.isNumber(val),
                        Validation.rangeOf(val, 40, 222)
                    ])
                },
                {
                    id: 'weight',
                    helpText: 'Weight (Kg)',
                    type: FieldType.TT_TEXT,
                    unload: async (d: any, s: string, f: any) => {
                        const weight = f.weight.value
                        const height = f.height.value
                        const bmi = await BMIService.getBMI(
                            weight, height, 
                            this.patient.getGender(),
                            this.patient.getAge()
                        )

                        this.stagingFacts.bmi = bmi['index']

                        if (!this.staging.isPedaid()) return

                        const medianWh = await this.patient.getMedianWeightHeight()

                        try {
                            //TODO: this calculation is already defined in patient_service.. must refactor it to make it reusable here
                            this.stagingFacts.weightPercentile = parseFloat(weight) / (parseFloat(medianWh["weight"])) * 100
                        } catch (e) {
                            this.stagingFacts.weightPercentile = 0
                        }
                    },
                    computedValue: ({ value }: Option) => ({
                        obs: this.vitals.buildValueNumber('weight', value)
                    }),
                    condition: (f: any) => f.has_transfer_letter.value === 'Yes',
                    validation: (val: any) => this.validateSeries([
                        this.vitals.isNotEmptyandFloat(val),
                        Validation.rangeOf(val, 1, 300)
                    ]),
                    config: {
                        customKeyboard: [
                            [
                                ['1', '2', '3', ''],
                                ['4', '5', '6', ''],
                                ['7', '8', '9', '.'],
                                ['',  '0', '' , '']
                            ],
                            [
                                ['Delete']
                            ]
                        ]
                    }
                },
                /*** 
                    Start Staging Fields
                ***/
                ...this.getStagingFields(),
                /** 
                    End Staging Fields
                ***/
                {
                    id: 'new_cd4_percent_available',
                    helpText: 'CD4 percent available',
                    type: FieldType.TT_SELECT,
                    options: () => this.getYesNoOptions(),
                    condition: (f: any) => f.has_transfer_letter.value === 'Yes',
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'cd4_percent',
                    helpText: 'CD4 Percent',
                    type: FieldType.TT_TEXT,
                    condition: (f: any) => f.new_cd4_percent_available.value === 'Yes',
                    computedValue: ({ value }: Option) => ({
                        tag:'reg',
                        obs: this.registration.buildValueNumber(
                            'CD4 percent', parseInt(value.toString().substring(1)), '%'
                        )
                    }),
                    onValue: (d: Option) => {
                        if (d.value && !this.staging.cd4CountIsValid(d.value)) {
                            toastWarning('Cd4 percentage invalid. Use one modifier or start with either of these symbols: >, < or =')
                            return false
                        }
                        return true
                    },
                    validation: (val: any) => Validation.required(val),
                    config: {
                        customKeyboard: [
                            CD4_COUNT_PAD_LO,
                            [
                                ['Delete']
                            ]
                        ]
                    }
                },
                {
                    id: 'type_of_confirmatory_hiv_test',
                    helpText: 'Confirmatory HIV test',
                    type: FieldType.TT_SELECT,
                    validation: (val: any) => Validation.required(val),
                    computedValue: ({ value }: Option) => ({
                        tag:'reg',
                        obs: this.registration.buildValueCoded(
                            'Confirmatory hiv test type', value
                        )
                    }),
                    options: () => ([
                        { label: 'Rapid antibody test', value: 'HIV rapid test'},
                        { label: 'DNA PCR', value: 'HIV DNA polymerase chain reaction'},
                        { label: 'Not done', value: 'Not done' }
                    ])
                },
                {
                    id: 'confirmatory_hiv_test_location',
                    helpText: 'Location of confirmatory HIV test',
                    type: FieldType.TT_SELECT,
                    computedValue: (d: Option) => ({
                        tag:'reg',
                        obs: this.registration.buildValueText(
                            'Confirmatory HIV test location', d.label
                        ) 
                    }),
                    validation: (val: any) => Validation.required(val),
                    condition: (f: any) => f.type_of_confirmatory_hiv_test.value != 'Not done',
                    options: (_: any, filter='') => this.getFacilities(filter),
                    config: {
                        showKeyboard: true,
                        isFilterDataViaApi: true
                    }
                },
                {
                    id: 'confirmatory_hiv_test_year',
                    helpText: 'Confirmatory HIV test year',
                    type: FieldType.TT_NUMBER,
                    appearInSummary: () => false,
                    condition: (f: any) => f.confirmatory_hiv_test_location.value,
                    validation: (val: any) => {
                        if (val.value != 'Unknown') {
                            const date = HisDate.stitchDate(val.value)
                            return this.validateSeries([
                                Validation.required(val),
                                Validation.isNumber(val),
                                this.yearNotHundredAgo(val.value),
                                this.dateBeforeBirthDate(date),
                                this.dateInFuture(date)
                            ])
                        }
                    }
                },
                {
                    id: 'confirmatory_hiv_test_month',
                    helpText: 'Confirmatory HIV test month',
                    type: FieldType.TT_SELECT,
                    appearInSummary: () => false,
                    options: () => MonthOptions,
                    condition: (f: any) => f.confirmatory_hiv_test_year.value != "Unknown",
                    validation: (val: any, f: any) => {
                        if (val.value === 'Unknown') {
                            const date = HisDate.stitchDate(
                                f.confirmatory_hiv_test_year.value, 
                                val.value
                            )
                            return this.validateSeries([
                                Validation.required(val),
                                this.dateBeforeBirthDate(date),
                                this.dateInFuture(date)
                            ])
                        }
                    } 
                },
                {
                    id: 'day_confirmatory_hiv_test',
                    helpText: 'Confirmatory HIV test day',
                    type: FieldType.TT_MONTHLY_DAYS,
                    summaryMapValue: (_: Option, f: any, computedValue: any) => ({
                        label: 'Confirmatory test Date', value: computedValue.date
                    }),
                    computedValue: (d: Option, f: any) => {
                        const date = HisDate.stitchDate(
                            f.confirmatory_hiv_test_year.value,
                            f.confirmatory_hiv_test_month.value,
                            d.value
                        )
                        return {
                            tag:'reg',
                            date: date,
                            obs: this.registration.buildValueDate('Confirmatory HIV test date', date),
                        }
                    },
                    condition: (f: any) => f.confirmatory_hiv_test_month.value != 'Unknown',
                    validation: (val: any, f: any, { date }: any) => {
                        return this.validateSeries([
                            Validation.required(val),
                            Validation.isNumber(val),
                            this.dateBeforeBirthDate(date),
                            this.dateInFuture(date)
                        ])
                    }
                },
                this.getStagingSummaryField('Staging summary')
            ]
        }
    }
})
</script>

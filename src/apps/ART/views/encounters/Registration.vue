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
import HisDate from "@/utils/Date"

export default defineComponent({
    mixins: [StagingMixin],
    data: () => ({
        registration: {} as any
    }),
    watch: {
        patient: {
            async handler(patient: any){
                if (!patient) return

                this.registration = new ClinicRegistrationService(patient.getID())

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
        async onSubmit(f: any, formObservations: any) {
            const encounter = await this.registration.createEncounter()

            if (!encounter) return toastWarning('Unable to create registration encounter')

            try {
                if (this.isShowStaging) await this.submitStaging()
            } catch(e) {
                return toastWarning(e)
            }

            const data = await this.resolveObs(formObservations)

            const obs = await this.registration.saveObservationList(data)

            if (!obs) return toastWarning('Unable to save observations')

            toastSuccess('Clinic registration complete!')

            this.nextTask()
        },
        resolveObs(obs: any) {
            let values: Array<any> = []
            Object.values(obs).forEach((o: any) => {
                if (Array.isArray(o)) {
                    values = [...values, ...o]
                } else {
                    values.push(o)
                }
            })
            return Promise.all(values)
        },
        getRegistrationFields() {
            return [
                {
                    id: 'followup_agreement',
                    helpText: 'Agrees to follow-up',
                    type: FieldType.TT_MULTIPLE_YES_NO,
                    validation: (v: any) => Validation.anyEmpty(v),
                    output: (d: Array<Option>) => {
                        const obs: any = []
                        d.forEach(({ label, value }: Option) => {
                            obs.push(this.registration.buildValueCoded('Agrees to followup', label))
                            obs.push(this.registration.buildValueCoded(label, value))
                        })
                        return obs
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
                    output: (d: Option) => this.registration.buildValueCoded(
                        'Ever registered at ART clinic', d.value
                    ),
                    validation: (v: any) => Validation.required(v),
                    options: () => this.getYesNoOptions()
                },
                {
                    id: 'year_last_taken_arvs',
                    helpText: 'Year last taken ARVs',
                    type: FieldType.TT_NUMBER,
                    condition: (f: any) => f.received_arvs.value === 'Yes',
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'month_last_taken_arvs',
                    helpText: 'Month last taken ARVs',
                    type: FieldType.TT_SELECT,
                    options: () => MonthOptions,
                    condition: (f: any) => f.year_last_taken_arvs.value != 'Unknown',
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'day_last_taken_arvs',
                    helpText: 'Day last taken ARVs',
                    type: FieldType.TT_MONTHLY_DAYS,
                    output: (d: Option, f: any) => {
                        const date = HisDate.stitchDate(
                            f.year_last_taken_arvs.value,
                            f.month_last_taken_arvs.value,
                            d.value
                        )
                        return this.registration.buildValueDate('Date ART last taken', date)
                    },
                    condition: (f: any) => f.month_last_taken_arvs.value,
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'taken_art_in_last_two_months',
                    helpText: 'Taken ARVs in the last two months?',
                    type: FieldType.TT_SELECT,
                    validation: (v: any) => Validation.required(v),
                    output: (d: Option) => this.registration.buildValueCoded(
                        'Has the patient taken ART in the last two months', d.value
                    ),
                    condition: (f: any) => f.year_last_taken_arvs.value === 'Unknown',
                    options: () => [...this.getYesNoOptions(), { label: 'Unknown', value: 'Unknown' }]
                },
                {
                    id: 'taken_art_in_last_two_weeks',
                    helpText: 'Ever received ARVs for treatment or prophylaxis?',
                    type: FieldType.TT_SELECT,
                    output: (d: Option) => this.registration.buildValueCoded(
                        'Has the patient taken ART in the last two weeks', d.value
                    ),
                    validation: (v: any) => Validation.required(v),
                    condition: (f: any) => f.taken_art_in_last_two_months.value === 'Yes',
                    options: () => [...this.getYesNoOptions(), { label: 'Unknown', value: 'Unknown' }]
                },
                {
                    id: 'ever_registered_at_art_clinic',
                    helpText: 'Ever registered at an ART clinic?',
                    type: FieldType.TT_SELECT,
                    output: (d: Option) => this.registration.buildValueCoded(
                        'Ever registered at ART clinic', d.value
                    ),
                    validation: (v: any) => Validation.required(v),
                    condition: (f: any) => f.received_arvs.value === 'Yes',
                    options: () => this.getYesNoOptions()
                },
                {
                    id: 'location_of_art_initialization',
                    helpText: 'Location of ART initiation',
                    type: FieldType.TT_SELECT,
                    output: (d: Option) => this.registration.buildValueText(
                        'Location of ART initiation', d.label
                    ),
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
                    condition: (f: any) => f.ever_registered_at_art_clinic.value === 'Yes',
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'month_started_art',
                    helpText: 'Month last taken ARVs',
                    type: FieldType.TT_SELECT,
                    options: () => MonthOptions,
                    condition: (f: any) => f.year_started_art.value != 'Unknown',
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'day_started_art',
                    helpText: 'Day started ART',
                    type: FieldType.TT_MONTHLY_DAYS,
                    output: (d: Option, f: any) => {
                        const date = HisDate.stitchDate(
                            f.year_started_art.value,
                            f.month_started_art.value,
                            d.value
                        )
                        return this.registration.buildValueDate('Drug start date', date)
                    },
                    condition: (f: any) => f.month_started_art.value != 'Unknown',
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'art_start_date_estimation',
                    helpText: 'Estimated time since ART initiation',
                    type: FieldType.TT_SELECT,
                    validation: (val: any) => Validation.required(val),
                    condition: (f: any) => f.year_started_art.value === "Unknown",
                    output: (d: Option) => {
                        const date = new Date()
                        date.setDate(date.getDate() - parseInt(d.value.toString()))
                        return this.registration.buildValueDate(
                            'Drug start date', HisDate.toStandardHisFormat(date)
                        )
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
                    id: 'has_transfer_letter',
                    helpText: 'Has staging information?',
                    type: FieldType.TT_SELECT,
                    validation: (v: any) => Validation.required(v),
                    output: (d: Option) => this.registration.buildValueCoded(
                        'Has transfer letter', d.value
                    ),
                    unload: (d: any) => this.isShowStaging = d.value === 'Yes',
                    condition: (f: any) => f.ever_registered_at_art_clinic.value === 'Yes',
                    options: () => this.getYesNoOptions()
                },
                {
                    id: 'height',
                    helpText: 'Height (CM)',
                    type: FieldType.TT_NUMBER,
                    condition: (f: any) => f.has_transfer_letter.value === 'Yes',
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'weight',
                    helpText: 'Weight (Kg)',
                    type: FieldType.TT_NUMBER,
                    condition: (f: any) => f.has_transfer_letter.value === 'Yes',
                    validation: (val: any) => Validation.required(val)
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
                    output: (d: Option) => this.registration.buildValueCoded(
                        'Confirmatory hiv test type', d.value
                    ),
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
                    output: (d: Option) => this.registration.buildValueText(
                        'Confirmatory HIV test location', d.label
                    ),
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
                    condition: (f: any) => f.confirmatory_hiv_test_location.value,
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'confirmatory_hiv_test_month',
                    helpText: 'Confirmatory HIV test month',
                    type: FieldType.TT_SELECT,
                    options: () => MonthOptions,
                    condition: (f: any) => !f.confirmatory_hiv_test_year.value.match(/Unknown/i),
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'day_confirmatory_hiv_test',
                    helpText: 'Confirmatory HIV test day',
                    type: FieldType.TT_MONTHLY_DAYS,
                    output: (d: Option, f: any) => {
                        const date = HisDate.stitchDate(
                            f.confirmatory_hiv_test_year.value,
                            f.confirmatory_hiv_test_month.value,
                            d.value
                        )
                        return this.registration.buildValueDate('Confirmatory HIV test date', date)
                    },
                    condition: (f: any) => f.confirmatory_hiv_test_month.value != 'Unknown',
                    validation: (val: any) => Validation.required(val)
                },
                this.getStagingSummaryField()
            ]
        }
    }
})
</script>

<template>
    <his-standard-form :skipSummary="isShowStaging" :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import MonthOptions from "@/components/FormElements/Presets/MonthOptions"
import Validation from "@/components/Forms/validations/StandardValidations"
import StagingMixin from "@/apps/ART/views/encounters/StagingMixin.vue"
import { CD4_COUNT_PAD_LO } from "@/components/Keyboard/KbLayouts"

export default defineComponent({
    mixins: [StagingMixin],
    watch: {
        patient: {
            async handler(patient: any){
                if (!patient) return

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
        async onSubmit() {
            console.log('Save something')
        },
        getRegistrationFields() {
            return [
                {
                    id: 'followup_agreement',
                    helpText: 'Agrees to follow-up',
                    type: FieldType.TT_MULTIPLE_YES_NO,
                    validation: (v: any) => Validation.anyEmpty(v),
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
                    condition: (f: any) => !f.year_last_taken_arvs.value.match(/Unknown/i),
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'day_last_taken_arvs',
                    helpText: 'Day last taken ARVs',
                    type: FieldType.TT_MONTHLY_DAYS,
                    condition: (f: any) => f.month_last_taken_arvs.value,
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'taken_art_in_last_two_months',
                    helpText: 'Taken ARVs in the last two months?',
                    type: FieldType.TT_SELECT,
                    validation: (v: any) => Validation.required(v),
                    condition: (f: any) => f.year_last_taken_arvs.value.match(/Unknown/i),
                    options: () => [...this.getYesNoOptions(), { label: 'Unknown', value: 'Unknown' }]
                },
                {
                    id: 'taken_art_in_last_two_weeks',
                    helpText: 'Ever received ARVs for treatment or prophylaxis?',
                    type: FieldType.TT_SELECT,
                    validation: (v: any) => Validation.required(v),
                    condition: (f: any) => f.taken_art_in_last_two_months.value === 'Yes',
                    options: () => [...this.getYesNoOptions(), { label: 'Unknown', value: 'Unknown' }]
                },
                {
                    id: 'ever_registered_at_art_clinic',
                    helpText: 'Ever registered at an ART clinic?',
                    type: FieldType.TT_SELECT,
                    validation: (v: any) => Validation.required(v),
                    condition: (f: any) => f.received_arvs.value === 'Yes',
                    options: () => this.getYesNoOptions()
                },
                {
                    id: 'location_of_art_initialization',
                    helpText: 'Location of ART initiation',
                    type: FieldType.TT_SELECT,
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
                    condition: (f: any) => !f.year_started_art.value.match(/Unknown/i),
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'day_started_art',
                    helpText: 'Day started ART',
                    type: FieldType.TT_MONTHLY_DAYS,
                    condition: (f: any) => f.month_started_art.value,
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'art_start_date_estimation',
                    helpText: 'Estimated time since ART initiation',
                    type: FieldType.TT_SELECT,
                    validation: (val: any) => Validation.required(val),
                    condition: (f: any) => f.year_started_art.value.match(/unknown/i),
                    options: () => ([
                        { label: '6 months', value: '6 months' },
                        { label: '12 months', value: '12 months' },
                        { label: '18 months', value: '18 months' },
                        { label: '24 months', value: '24 months' },
                        { label: 'Over 2 years', value: 'Over 2 years' }
                    ]),
                },
                {
                    id: 'has_transfer_letter',
                    helpText: 'Has staging information?',
                    type: FieldType.TT_SELECT,
                    validation: (v: any) => Validation.required(v),
                    unload: (d: any) => d.value === 'Yes' ? this.isShowStaging = true : this.isShowStaging = false,
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
                ...this.getStagingFields(),
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
                    condition: (f: any) => f.has_transfer_letter.value === 'Yes',
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
                    condition: (f: any) => f.confirmatory_hiv_test_location,
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
                    condition: (f: any) => f.confirmatory_hiv_test_month,
                    validation: (val: any) => Validation.required(val)
                },
                this.getStagingSummaryField()
            ]
        }
    }
})
</script>

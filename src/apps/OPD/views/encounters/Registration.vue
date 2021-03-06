<template>
    <his-standard-form :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Option } from "@/components/Forms/FieldInterface"
import Validation from "@/components/Forms/validations/StandardValidations"
import StagingMixin from "@/apps/ART/views/encounters/StagingMixin.vue"
import {ClinicRegistrationService} from "@/apps/ART/services/registration_service"
import { CD4_COUNT_PAD_LO } from "@/components/Keyboard/KbLayouts"
import { toastWarning, toastSuccess} from "@/utils/Alerts"
import { VitalsService } from "@/apps/ART/services/vitals_service";
import { BMIService } from "@/services/bmi_service"
import { generateDateFields } from "@/utils/HisFormHelpers/MultiFieldDateHelper"
import HisDate from "@/utils/Date"

export default defineComponent({
    mixins: [StagingMixin],
    data: () => ({
        registration: {} as any,
        vitals: {} as any,
    }),
    watch: {
        patient: {
            async handler(patient: any){
                this.registration = new ClinicRegistrationService(patient.getID())
                this.vitals = new VitalsService(patient.getID())
                await this.initStaging(this.patient)

                this.showStagingWeightChart = false
                this.fields = this.getRegistrationFields()
            },
            deep: true
        }
    },
    methods: {
        async onSubmit(f: any, computedData: any) {
            const fObs = {...computedData}
            const encounter = await this.registration.createEncounter()

            if (!encounter) return toastWarning('Unable to create registration encounter')

            try {
                if (this.hasStaging(f)) {
                    await this.submitStaging(computedData)
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
        buildDateObs(conceptName: string, date: string, isEstimate: boolean) {
            let obs = {}
            if (isEstimate) {
                obs = this.registration.buildValueDateEstimated(conceptName, date)
            } else {
                obs = this.registration.buildValueDate(conceptName, date)
            }
            return obs
        },
        getRegistrationFields() {
            return [
                {
                    id: 'followup_agreement',
                    helpText: 'Agrees to follow-up',
                    type: FieldType.TT_MULTIPLE_YES_NO,
                    summaryMapValue: ({value, label}: Option) => ({
                        value,
                        label: `${label} followup`
                    }),
                    validation: (v: any) => Validation.anyEmpty(v),
                    computedValue: (d: Array<Option>) => {
                        const obs: any = []
                        d.forEach(({ label, value }: Option) => {
                            obs.push(this.registration.buildValueCoded(label, value))
                            obs.push(this.registration.buildValueCoded('Agrees to followup', label))
                        })
                        return { tag:'reg', obs }
                    },
                    options: () => ([
                        {
                            label: 'Phone',
                            value: '',
                            other: {
                                values: this.yesNoOptions(),
                            }
                        },
                        {
                            label: 'Home visit',
                            value: '',
                            other: {
                                values: this.yesNoOptions()
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
                    options: () => this.yesNoOptions()
                },
                ...generateDateFields({
                    id: 'date_last_taken_arvs',
                    helpText: 'Last taken ARVS',
                    condition: (f: any) => f.received_arvs.value === 'Yes',
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
                            tag:'reg',
                            isEstimate,
                            obs: this.buildDateObs('Date ART last taken', date, isEstimate) 
                        }
                    }
                }, this.registration.getDate()),
                {
                    id: 'taken_art_in_last_two_months',
                    helpText: 'Taken ARVs in the last two months?',
                    type: FieldType.TT_SELECT,
                    validation: (v: any) => Validation.required(v),
                    computedValue: ({value}: Option) => {
                        return {
                            tag:'reg',
                            obs: [
                                this.registration.buildValueCoded(
                                    'Has the patient taken ART in the last two months', value
                                )
                            ]
                        }
                    },
                    options: () => this.yesNoUnknownOptions(),
                    condition: (f: any) => f.year_date_last_taken_arvs.value === 'Unknown'
                },
                {
                    id: 'taken_art_in_last_two_weeks',
                    helpText: "Taken ARV's in the last two weeks?",
                    type: FieldType.TT_SELECT,
                    computedValue: ({ value }: Option, f: any) => {
                        let date = ''
                        const obs = []
                        let duration = -1

                        if (value === 'Yes') {
                            duration = 14
                        } else if (f.taken_art_in_last_two_months.value === 'Yes') {
                            duration = 60
                        }

                        if (duration > 0) {
                            date = HisDate.getDateBeforeByDays(this.registration.getDate(), duration)
                            obs.push(this.registration.buildValueDateEstimated('Date ART last taken', date))
                        }
                        return {
                            date,
                            tag:'reg',
                            obs: [
                                ...obs,
                                this.registration.buildValueCoded(
                                    'Has the patient taken ART in the last two weeks', value
                                )
                            ]
                        }
                    },
                    validation: (v: any) => Validation.required(v),
                    condition: (f: any) => f.taken_art_in_last_two_months.value === 'Yes',
                    options: () => this.yesNoUnknownOptions()
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
                    options: () => this.yesNoOptions()
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
                ...generateDateFields({
                    id: 'date_started_art',
                    helpText: 'Started ART',
                    condition: (f: any) => f.ever_registered_at_art_clinic.value === 'Yes',
                    validation: (val: any) => {
                        return this.validateSeries([
                            () => Validation.required(val),
                            () => this.dateBeforeBirthDate(val.value),
                            () => this.dateInFuture(val.value)
                        ])
                    },
                    computeValue: (date: string, isEstimate: boolean) => {
                        this.staging.setDate(date)
                        this.vitals.setDate(date)
                        return {
                            date,
                            tag:'reg',
                            isEstimate,
                            obs: this.buildDateObs('Drug start date', date, isEstimate) 
                        }
                    },
                }, this.registration.getDate(), true),
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
                    options: () => this.yesNoOptions(),
                    condition: (f: any) => f.ever_registered_at_art_clinic.value === 'Yes',
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
                        () => Validation.required(val),
                        () => Validation.isNumber(val),
                        () => Validation.rangeOf(val, 40, 222)
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
                        tag:'vitals',
                        obs: this.vitals.buildValueNumber('weight', value)
                    }),
                    condition: (f: any) => f.has_transfer_letter.value === 'Yes',
                    validation: (val: any) => this.validateSeries([
                        () => this.vitals.isNotEmptyandFloat(val),
                        () => Validation.rangeOf(val, 1, 300)
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
                    options: () => this.yesNoOptions(),
                    condition: (f: any) => f.has_transfer_letter.value === 'Yes',
                    validation: (val: any) => Validation.required(val)
                },
                {
                    id: 'cd4_percent',
                    helpText: 'CD4 Percent',
                    type: FieldType.TT_TEXT,
                    condition: (f: any) => f.new_cd4_percent_available.value === 'Yes',
                    computedValue: ({ value }: Option) => ({
                        tag:'staging',
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
                ...generateDateFields({
                    id: 'date_of_confirmatory_hiv_test',
                    helpText: 'Confirmatory HIV test',
                    condition: (f: any) => f.confirmatory_hiv_test_location.value,
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
                            tag:'reg',
                            isEstimate,
                            obs: this.buildDateObs('Confirmatory HIV test date', date, isEstimate) 
                        }
                    },
                }, this.registration.getDate(), true),
                this.getStagingSummaryField('Staging summary')
            ]
        }
    }
})
</script>

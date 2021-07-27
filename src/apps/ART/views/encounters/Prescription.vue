<template>
    <his-standard-form :activeField="facts.currentField" :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { RegimenInterface } from "@/interfaces/Regimen"
import Validation from "@/components/Forms/validations/StandardValidations"
import { PrescriptionService } from "@/apps/ART/services/prescription_service"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import HisDate from "@/utils/Date"
import { matchToGuidelines } from "@/utils/GuidelineEngine"
import { isEmpty } from "lodash"
import EncounterMixinVue from './EncounterMixin.vue'

export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        drugs: [] as Array<RegimenInterface>,
        nextInterval: 0,
        prescription: {} as any,
        patientToolbar: [] as Array<Option>,
        facts: {
            age: -1 as number,
            gender: '' as string,
            weight: -1 as number,
            patientAdverseEffects: [] as Array<string>,
            currentRegimenCode: -1 as number,
            currentField: '' as string,
            selectedDrug: '' as string,
            selectedDrugs: [] as Array<any>,
            selectedDrugContraIndications: [] as Array<any>,
            selectedRegimenCode: -1 as number,
            hangingPills: [] as Array<any>,
            reasonForSwitch: '' as string,
            starterPackNeeded: false as boolean,
            hangingPillsStatus: '' as string,
            treatmentInitiationState: '' as string,
            lpvType: '' as string,
            medicationOrders: [] as Array<any>,
            selectedInterval: 0 as number
        }
    }),
    watch: {
        patient: {
            async handler(patient: any){
                if (!patient) return

                this.prescription = new PrescriptionService(patient.getID())
                await this.prescription.loadMedicationOrders()
                await this.prescription.loadFastTrackStatus()

                if (!this.prescription.medicationOrdersAvailable() && !this.prescription.isFastTrack()) {
                    toastWarning('Patient is not eligible for treatment Today! Please check HIV Clinic Consultation')
                    return this.nextTask()
                }

                await this.prescription.loadRegimenExtras()
                await this.prescription.loadHangingPills()
                await this.prescription.loadTreatmentState()
                await this.prescription.loadAdverseEffects()

                await this.init(patient)

                if (this.prescription.isFastTrack()) {
                    await this.prescription.loadFastTrackMedications()
                    this.drugs = this.prescription.getFastTrackMedications()
                    this.facts.currentField = 'next_visit_interval'

                } else if (!this.prescription.shouldPrescribeArvs() && this.prescription.shouldPrescribeExtras()) {
                    this.drugs = this.prescription.getRegimenExtras()
                }

                this.patientToolbar = await this.getPatientToolBar()
                this.fields = this.getFields()
            },
            immediate: true,
            deep: true
        },
        'facts.starterPackNeeded': {
            async handler(starterPackNeeded: boolean) {
                if (starterPackNeeded){
                    this.drugs = await this.prescription.getRegimenStarterpack(
                        this.facts.selectedRegimenCode, this.facts.weight
                    )
                    this.facts.currentField = 'selected_meds'
                }
            },
            immediate: true
        }
    },
    methods: {
        async init(patient: any) {
            this.facts.age = patient.getAge()
            this.facts.gender = patient.getGender() === 'Female' ? 'F' : 'M'
            this.facts.weight = await patient.getRecentWeight()
            this.facts.hangingPills = this.prescription.getHangingPills()
            this.facts.treatmentInitiationState = this.prescription.getTreatmentState()
            this.facts.currentRegimenCode = this.extractRegimenCode(this.programInfo.current_regimen)
            this.facts.medicationOrders = this.prescription.getMedicationOrders()
            this.facts.patientAdverseEffects = this.prescription.getAdverseEffects()
        },
        async onSubmit() {
            const encounter = await this.prescription.createEncounter()

            const payload = this.mapOrder(this.drugs)

            this.prescription.setNextVisitInterval(this.nextInterval)

            if (!encounter) return toastWarning('Unable to create treatment encounter')

            const drugOrder = await this.prescription.createDrugOrder(payload) 

            if(!drugOrder) return toastWarning('Unable to create drug orders!')

            if (this.facts.reasonForSwitch) {
                await this.prescription.createRegimenSwitchObs(this.facts.reasonForSwitch)
            }

            if (this.facts.hangingPillsStatus) {
                await this.prescription.createHangingPillsObs(this.facts.hangingPillsStatus)
            }

            toastSuccess('Drug order has been created')

            this.nextTask()
        },
        async onRegimen({ value, other }: Option) {
            this.facts.hangingPillsStatus = ''
            this.facts.starterPackNeeded = false
            this.facts.selectedRegimenCode = this.extractRegimenCode(value.toString())
            this.facts.selectedDrugs = other.regimenDrugs.map((d: any) => d.drug_id)
            this.facts.selectedDrugContraIndications = this.prescription.getRegimenContraIndications(
                this.facts.selectedRegimenCode
            ) 
            const guidelines = this.prescription.getRegimenGuidelines()
            const findings = matchToGuidelines(this.facts, guidelines)

            for(const index in findings) {
                const finding = findings[index]

                if (!finding?.actions?.alert) 
                    continue

                const state = await finding?.actions?.alert(this.facts)

                if (state === 'exit')
                    return false
            }
            return true
        },
        async buildRegimenOptions() {
            const regimenCategories = await this.prescription.getPatientRegimens()
            const options = []
            for(const value in regimenCategories) {
                const regimenDrugs = regimenCategories[value]
                const label = regimenDrugs.map((r: RegimenInterface) => 
                    r.alternative_drug_name || r.concept_name).join(' + ')

                options.push({ 
                    label, 
                    value, 
                    other: {
                        regimenDrugs 
                    } 
                })
            }
            return options
        },
        buildIntervalOptions() {
            const intervals = [
                { label: '2 weeks', value: 14 },
                { label: '1 month', value: 28 },
                { label: '2 months', value: 56 },
                { label: '3 months', value: 84 },
                { label: '4 months', value: 112 },
                { label: '5 months', value: 140 },
                { label: '6 months', value: 168 },
                { label: '7 months', value: 196 },
                { label: '8 months', value: 224 },
                { label: '9 months', value: 252 },
                { label: '10 months', value: 280 },
                { label: '11 months', value: 308 },                        
                { label: '12 months', value: 336 },
            ]
            const guidelines = this.prescription.getIntervalGuidelines()

            return intervals.map(({label, value}: Option) => {
                let enabled = true
                this.facts.selectedInterval = parseInt(value.toString())
                const findings = matchToGuidelines(this.facts, guidelines)

                if (!isEmpty(findings) && findings[0]?.actions)
                    enabled = findings[0].actions.enabled

                return {
                    label,
                    value,
                    other: {
                        enabled,
                        ...this.getDrugEstimates(this.drugs, this.facts.selectedInterval)
                    }
                }
            })
        },
        getDrugFrequency(drugName: string){
            this.facts.selectedDrug = drugName
            const guidelines = this.prescription.getDrugFrequencyGuidelines()
            const findings = matchToGuidelines(this.facts, guidelines)

            if (!isEmpty(findings)) {
                return findings[0].concept
            }
        },
        extractRegimenCode(regimen: string): number {
           if (regimen.match(/n\/a/i))
               return -1

           return parseInt(regimen.substring(0, regimen.length))
        },
        getDosageTableOptions(regimen: any) {
            const rowColors: any = [ 
                { indexes: [], class: 'adult-regimen-formulation' },
                { indexes: [], class: 'pedaid-regimen-formulation' }
            ]
            const columns = ['Drug name', 'Units', 'AM', 'Noon', 'PM', 'Frequency']
            const rows = regimen.map((regimen: any, index: number) => {
                switch(regimen.regimen_category) {
                    case 'A':
                        rowColors[0].indexes.push(index)
                        break
                    case 'P':
                        rowColors[1].indexes.push(index)
                }
                return [
                    regimen.drug_name,
                    regimen.units,
                    regimen.am,
                    regimen.noon,
                    regimen.pm,
                    regimen.frequency || this.getDrugFrequency(regimen.drug_name)
                ]              
            })
            return [
                { 
                    label: 'Selected Medication', 
                    value:'Table', 
                    other: { columns, rows, rowColors }
                }      
            ]
        },
        getDrugEstimates(regimens: any, interval: number) {
            this.prescription.setNextVisitInterval(interval)
            const nextAppointment = this.prescription.calculateDateFromInterval()
            const drugPacks = regimens.map((regimen: RegimenInterface) => {
                const packSize = this.prescription.getDrugPackSize(regimen)
                const pillsPerDay = this.prescription.calculatePillsPerDay(regimen.am, regimen.noon, regimen.pm)
                const estimatedPackSize = this.prescription.estimatePackSize(pillsPerDay, packSize)     
                return {
                    label: regimen.alternative_drug_name || regimen.drug_name,
                    value: estimatedPackSize
                } 
            })
            return {
                label: 'Medication run-out date:',
                value: HisDate.toStandardHisDisplayFormat(nextAppointment),
                other: {
                    label: "Estimated packs/tins:",
                    value: drugPacks
                }
            }
        },
        mapOrder(regimens: Array<RegimenInterface>) {
            return regimens.map((regimen: any) => {
                return this.prescription.toOrderObj(
                    regimen.drug_id, 
                    regimen.drug_name,
                    regimen.units, 
                    regimen.am, 
                    regimen.pm,
                    regimen.frequency || this.getDrugFrequency(regimen.drug_name)
                )
            })
        },
        hasCustomRegimen() {
            return this.facts.currentField === "custom_regimen"
        },
        async getPatientToolBar() {
            const reasonForSwitch = await this.prescription.getReasonForRegimenSwitch()
            return [
                { label: 'Age', value: `${this.patient.getAge()} Year(s)` },
                { label: 'Gender', value: this.patient.getGender() },
                { label: 'Current Regimen', value: this.programInfo.current_regimen },
                { label: 'Current weight', value: `${this.facts.weight} kg(s)` || 'Unknown' },
                { label: 'Reason for change', value: reasonForSwitch }
            ]
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'arv_regimens',
                    helpText: 'ARV Regimen(s)',
                    type: FieldType.TT_ART_REGIMEN_SELECTION,
                    condition: () => this.prescription.shouldPrescribeArvs(),
                    validation: (val: Option) => Validation.required(val),
                    unload: (data: any) => {
                        if (!this.facts.starterPackNeeded) {
                            this.drugs = [
                                ...this.prescription.getRegimenExtras(), 
                                ...data.other.regimenDrugs
                            ]
                        }
                    },
                    options: () => this.buildRegimenOptions(),
                    onValue: (regimen: Option) => this.onRegimen(regimen),
                    config: {
                        toolbarInfo: this.patientToolbar,
                        footerBtns: [
                            {
                                name: 'Custom Regimen',
                                size: 'large',
                                slot: 'end',
                                color: 'primary',
                                visible: false,
                                visibleOnStateChange: (state: Record<string, any>) => {
                                    return state.index === 0
                                },
                                onClick: () => {
                                    this.facts.currentField = 'custom_regimen'
                                }
                            }
                        ]
                    }
                },
                {
                    id: 'custom_regimen',
                    helpText: 'Custom prescription',
                    type: FieldType.TT_MULTIPLE_SELECT,
                    condition: () => this.hasCustomRegimen(),
                    validation: (val: Option) => Validation.required(val),
                    options: async () => {
                        const drugs = await this.prescription.getCustomIngridients()
                        return drugs.map((drug: any ) => ({
                            label: drug.name,
                            value: drug.drug_id,
                            other: { ...drug }
                        }))
                    },
                    config: {
                        showKeyboard: true,
                        hiddenFooterBtns: [ 'Back' ],
                        footerBtns: [
                            {
                                name: 'Standard Regimen',
                                size: 'large',
                                slot: 'end',
                                color: 'primary',
                                visible: false,
                                visibleOnStateChange: (state: Record<string, any>) => {
                                    return state.index === 1
                                },
                                onClick: () => {
                                    this.facts.currentField = 'arv_regimens'
                                }
                            }
                        ]
                    }
                },
                {
                    id: 'custom_dosage',
                    helpText: 'Custom dose',
                    type: FieldType.TT_DOSAGE_INPUT,
                    condition: () => this.hasCustomRegimen(),
                    validation: (val: Array<Option>) => {
                        if (Validation.required(val)) return ['Drugs are not available']

                        const empty = val.map(({ other }: Option) => other.am <= 0 && other.pm <= 0)
                        return empty.some(Boolean) ? ['Missing dosage configuration on some drugs'] : null
                    },
                    unload: (data: any) => this.drugs = data.map((drug: Option) => drug.other),
                    summaryMapValue: ({other}: any) => ({
                        label: 'Dosages', 
                        value: this.prescription.getInstructions(
                            other.drug_name, other.am, other.pm, other.units
                        ) 
                    }),
                    options: (fdata: any) => {
                        return fdata.custom_regimen.map((regimen: Option) => ({
                            label: regimen.label,
                            value: regimen.value,
                            other: {
                                'drug_id': regimen.other.drug_id,
                                'drug_name': regimen.label,
                                'barcodes': regimen.other.barcodes,
                                'units': regimen.other.units,
                                'am': 0,
                                'noon': 0,
                                'pm': 0,
                                'frequency': this.getDrugFrequency(regimen.label)
                            }
                        }))
                    }
                },
                {
                    id: 'selected_meds',
                    helpText: 'Selected medication',
                    type: FieldType.TT_TABLE_VIEWER,
                    options: () => this.getDosageTableOptions(this.drugs),
                    config: {
                        hiddenFooterBtns: [ 'Clear' ]
                    }
                },
                {
                    id: 'next_visit_interval',
                    helpText: 'Interval to next visit',
                    type: FieldType.TT_NEXT_VISIT_INTERVAL_SELECTION,
                    validation: (val: Option) => Validation.required(val),
                    unload: async (data: any) => {
                        this.nextInterval = data.value
                    },
                    options: () => this.buildIntervalOptions(),
                    config: {
                        showRegimenCardTitle: false
                    }
                }
            ]
        }
    }
})
</script>

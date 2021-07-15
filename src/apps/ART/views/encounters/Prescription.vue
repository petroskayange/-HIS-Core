<template>
    <his-standard-form :activeField="fieldComponent" :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { RegimenInterface } from "@/interfaces/Regimen"
import Validation from "@/components/Forms/validations/StandardValidations"
import { PrescriptionService, HangingPill, REGIMEN_SWITCH_REASONS } from "@/apps/ART/services/prescription_service"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import HisDate from "@/utils/Date"
import EncounterMixinVue from './EncounterMixin.vue'
import { actionSheetController} from "@ionic/vue"
export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        drugs: [] as Array<RegimenInterface>,
        nextInterval: 0,
        prescription: {} as any,
        fieldComponent: '',
        patientToolbar: [] as Array<Option>,
        regimenSwitchReason: '' as string | undefined,
        hangingPillOptimization: '' as HangingPill | '',
        patientWeight: 0 as number,
        starterPackSelected: false as boolean
    }),
    watch: {
        patient: {
            async handler(patient: any){
                if (!patient) return

                this.patientWeight = await patient.getRecentWeight()
                this.prescription = new PrescriptionService(patient.getID())
                await this.prescription.loadMedicationOrders()
                await this.prescription.loadFastTrackStatus()

                if (!this.prescription.medicationOrdersAvailable() && !this.prescription.isFastTrack()) {
                    toastWarning('Patient is not eligible for treatment Today! Please check HIV Clinic Consultation')
                    return this.nextTask()
                }
                
                await this.prescription.loadRegimenExtras()
                await this.prescription.loadHangingPills()
                await this.prescription.load3HpStatus()
                await this.prescription.loadTreatmentState()

                if (this.prescription.isFastTrack()) {
                    await this.prescription.loadFastTrackMedications()
                    this.drugs = this.prescription.getFastTrackMedications()
                    this.fieldComponent = 'next_visit_interval'

                } else if (!this.prescription.shouldPrescribeArvs() && this.prescription.shouldPrescribeExtras()) {
                    this.drugs = this.prescription.getRegimenExtras()
                }

                this.patientToolbar = await this.getPatientToolBar()
                this.fields = this.getFields()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async onSubmit() {
            const encounter = await this.prescription.createEncounter()

            const payload = this.mapOrder(this.drugs)

            this.prescription.setNextVisitInterval(this.nextInterval)

            if (!encounter) return toastWarning('Unable to create treatment encounter')

            const drugOrder = await this.prescription.createDrugOrder(payload) 
            
            if(!drugOrder) return toastWarning('Unable to create drug orders!')

            if (this.regimenSwitchReason) {
                await this.prescription.createRegimenSwitchObs(this.regimenSwitchReason)
            }

            if (this.hangingPillOptimization) {
                await this.prescription.createHangingPillsObs(this.hangingPillOptimization)
            }

            toastSuccess('Drug order has been created')

            this.nextTask()
        },
        getDosageTableOptions(regimen: any) {
            const colorCodes = regimen.map((item: any) => {
                const category = item.regimen_category
                switch(category) {
                    case 'A':
                        return 'adult-regimen-formulation'
                    case 'P':
                        return 'pedaid-regimen-formulation'
                    default:
                        return ''
                }
            })
            const columns = ['Drug name', 'Units', 'AM', 'Noon', 'PM', 'Frequency']
            const rows = regimen.map((regimen: any) => {
                return [
                    regimen.drug_name,
                    regimen.units,
                    regimen.am,
                    regimen.noon,
                    regimen.pm,
                    regimen.frequency || this.prescription.getDrugFrequency(regimen.drug_name)
                ]              
            })
            return [
                { 
                    label: 'Selected Medication', 
                    value:'Table', 
                    other: { columns, rows, colorCodes }
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
                    regimen.frequency || ''
                )
            })
        },
        hasCustomRegimen() {
            return this.fieldComponent === "custom_regimen"
        },
        async getPatientToolBar() {
            const reasonForSwitch = await this.prescription.getReasonForRegimenSwitch()
            return [
                { label: 'Age', value: `${this.patient.getAge()} Year(s)` },
                { label: 'Gender', value: this.patient.getGender() },
                { label: 'Current Regimen', value: this.programInfo.current_regimen },
                { label: 'Current weight', value: `${this.patientWeight} kg(s)` || 'Unknown' },
                { label: 'Reason for change', value: reasonForSwitch }
            ]
        },
        async hangingPillsActionSheet() {
            const action = await actionSheetController.create({
                header: 'Do you want to use hanging pills?',
                mode: 'ios',
                backdropDismiss: false,
                buttons: [{ text: 'Yes', role: 'yes' }, { text: 'No', role: 'no' }]
            })
            action.present()
            const { role } = await action.onDidDismiss()
            return role
        },
        async starterPackActionSheet() {
            const action = await actionSheetController.create({
                header: 'First time initiation',
                subHeader: 'Starter pack needed for 14 days',
                mode: 'ios',
                backdropDismiss: false,
                buttons: [
                    { text: 'Prescribe starter pack', role: 'prescribe' }, 
                    { text: 'Cancel', role: 'cancel' }
                ]
            })
            action.present()
            const { role } = await action.onDidDismiss()
            return role === 'prescribe'
        },
        async regimenSwitchActionSheet() {
            const reasons = REGIMEN_SWITCH_REASONS.map((i: string) => ({ text: i, role: i}))
            const action = await actionSheetController.create({
                header: `Are you sure you want to replace ${this.programInfo.current_regimen}?`,
                subHeader: 'Specify reason for switching regimen',
                mode: 'ios',
                backdropDismiss: false,
                buttons: [ ...reasons, { text: 'Cancel', role: 'cancel' }]
            })
            action.present()
            const { role } = await action.onDidDismiss();

            if (role === 'cancel') {
                this.regimenSwitchReason = ''
                return false
            }

            this.regimenSwitchReason = role
            return true
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'arv_regimens',
                    helpText: 'ARV Regimen(s)',
                    type: FieldType.TT_ART_REGIMEN_SELECTION,
                    preset: { value: this.programInfo.current_regimen },
                    condition: () => this.prescription.shouldPrescribeArvs(),
                    validation: (val: Option) => Validation.required(val),
                    unload: (data: any) => {
                        if (!this.starterPackSelected) {
                            this.drugs = [
                                ...this.prescription.getRegimenExtras(), ...data.other.regimens
                            ]
                        }
                    },
                    options: async () => {
                        const regimenCategories = await this.prescription.getPatientRegimens()
                        const options = []
                        for(const index in regimenCategories) {
                            const regimens = regimenCategories[index]
                            const drug = regimens.map((regimen: RegimenInterface) => regimen.alternative_drug_name).join(' + ')
                            options.push({ label: drug, value: index, other: { regimens } })
                        }
                        return options
                    },
                    onValue: async ({ label, value }: Option) => {
                        this.starterPackSelected = false

                        if (value != this.programInfo.current_regimen) {
                            const res = await this.regimenSwitchActionSheet()
                            
                            if (!res) return false
                        }

                        if (this.prescription.starterPackNeeded(label)) {
                            const confirm = await this.starterPackActionSheet()

                            if (!confirm) return false

                            this.drugs = await this.prescription.getRegimenStarterpack(
                                value, this.patientWeight
                            )

                            this.drugs = [...this.prescription.getRegimenExtras(), ...this.drugs]
                            this.starterPackSelected = true
                            this.fieldComponent = 'selected_meds'
                        }

                        return true
                    },
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
                                    this.fieldComponent = 'custom_regimen'
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
                                    this.fieldComponent = 'arv_regimens'
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
                                'frequency': 'Daily (QOD)'
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
                    unload: async (data: any, state: string) => {
                        this.nextInterval = data.value
                        if (this.prescription.hasHangingPills(this.drugs) && state==='next') {
                            const res = await this.hangingPillsActionSheet()
                            if (res === 'yes') {
                                return this.hangingPillOptimization = HangingPill.OPTIMIZE
                            }
                            return this.hangingPillOptimization = HangingPill.EXACT
                        }
                        this.hangingPillOptimization = ''
                    },
                    options: () => {
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
                        return intervals.map(interval => ({
                            ...interval,  other: { ...this.getDrugEstimates(this.drugs, interval.value) }
                            })
                        )
                    },
                    config: {
                        showRegimenCardTitle: false
                    }
                }
            ]
        }
    }
})
</script>

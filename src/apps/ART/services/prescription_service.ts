import { DrugInterface } from "@/interfaces/Drug";
import { DrugOrderService } from "@/services/drug_order_service";
import { Observation } from "@/interfaces/observation";
import HisDate from "@/utils/Date"
import { RegimenService } from "@/services/regimen_service";
import { isEmpty } from "lodash"
import { AppEncounterService } from "@/services/app_encounter_service"
import {
    REGIMEN_SELECTION_GUIDELINES,
    INTERVAL_RECOMMENDATION,
    DRUG_FREQUENCY_GUIDELINE
} from "@/apps/ART/guidelines/prescription_guidelines"

export class PrescriptionService extends AppEncounterService {
    nextVisitInterval: number;
    fastTrack: boolean;
    regimenExtras: Array<Record<string, any>>;
    hangingPills: Array<Record<string, any>>;
    fastTrackMedications: Array<Record<string, any>>;
    medicationOrders: Array<number>;
    treatmentState: string;
    adverseEffects: Array<string>;
    constructor(patientID: number) {
        super(patientID, 25) //TODO: Use encounter type reference name
        this.nextVisitInterval = 0
        this.fastTrack = false
        this.regimenExtras = []
        this.fastTrackMedications = []
        this.hangingPills = []
        this.medicationOrders = []
        this.treatmentState = ''
        this.adverseEffects = []
    }

    setNextVisitInterval(nextVisitInterval: number) {
        this.nextVisitInterval = nextVisitInterval
    }

    getRegimenGuidelines() {
        return REGIMEN_SELECTION_GUIDELINES
    }

    getIntervalGuidelines() {
        return INTERVAL_RECOMMENDATION
    }

    getDrugFrequencyGuidelines() {
        return DRUG_FREQUENCY_GUIDELINE
    }

    getHangingPills() {
        return this.hangingPills
    }

    getMedicationOrders() {
        return this.medicationOrders.map((i: number) => {
            return AppEncounterService.getCachedConceptName(i)
        })
    }

    getAdverseEffects() { return this.adverseEffects }

    getRegimenExtras() { return this.regimenExtras }

    getPatientRegimens() { return RegimenService.getRegimens(this.patientID) }

    getCustomIngridients() { return RegimenService.getCustomIngridients() }

    getFastTrackMedications() { return this.fastTrackMedications }

    getTreatmentState() { return this.treatmentState }

    isFastTrack() { return this.fastTrack }

    medicationOrdersAvailable() { return !isEmpty(this.medicationOrders) }

    shouldPrescribeArvs() { 
        const arvs = AppEncounterService.getCachedConceptID("Antiretroviral drugs")
        return this.medicationOrders.includes(arvs)
    }

    shouldPrescribeExtras() {
        const extras = AppEncounterService.getConceptsByCategory('art_extra_medication_order')
        const extrasAvailable = extras.map((i: any) => this.medicationOrders.includes(i.concept_id))
        return extrasAvailable.some(Boolean)
    }

    getRegimenContraIndications(regimenCode: number) {
        const category = `${regimenCode}_regimen_adverse_reaction`
        const effects =  AppEncounterService.getConceptsByCategory(category)

        return !isEmpty(effects) ? effects.map(i => i.name) : []
    }

    getRegimenStarterpack(regimenCode: number, patientWeight: number) {
        const params = { weight: patientWeight, regimen: regimenCode }

        return AppEncounterService.getJson(
            `programs/${AppEncounterService.getProgramID()}/regimen_starter_packs`,
            params
        )
    }

    async loadAdverseEffects() {
        const effects = AppEncounterService.getConceptsByCategory('side_effect')
        effects.forEach(async (i: any) => {
            const sideEffect = await AppEncounterService.getFirstValueCoded(this.patientID, i.name)

            if (sideEffect === 'Yes') {
                this.adverseEffects.push(i.name)
            }
        })
    }

    async loadFastTrackStatus() {
        const isFastTrack = await AppEncounterService.getFirstValueCoded(this.patientID, 'Fast track')
        const yes = await AppEncounterService.getConceptID('yes')

        if (isFastTrack) this.fastTrack = isFastTrack === yes
    }
    
    async loadRegimenExtras(date=RegimenService.getSessionDate()) {
        const meds = await RegimenService.getJson(
            `programs/${RegimenService.getProgramID()}/patients/${this.patientID}/dosages`,
            {date}
        )
        if (meds) this.regimenExtras = Object.values(meds)
    }

    async loadMedicationOrders() {
        const medicationOrders = await AppEncounterService.getConceptID("Medication orders")
        const orders = await AppEncounterService.getObs({
            'concept_id': medicationOrders,
            'date': AppEncounterService.getSessionDate(),
            'person_id': this.patientID,
            'page_size': 5
        })
        this.medicationOrders = orders.map((i: Observation) => i.value_coded)
    }

    async loadHangingPills() {
        const pills = await AppEncounterService.getAll(this.patientID, 'Pills brought')
        if (pills) {
            this.hangingPills = pills.filter((o: any) => o.value_numeric >= 1)
                                     .map((o: any) => o.order.drug_order.drug_inventory_id)
        }
    }

    async loadFastTrackMedications() {
        const drugs = await DrugOrderService.getLastDrugsReceived(this.patientID)
        const withDosages = drugs.map(async(data: any) => {
            const { drug } = data
            const dosage = await DrugOrderService.getDrugDosages(this.patientID, drug.drug_id)
            return {
                'drug_id': drug.drug_id,
                'drug_name': drug.name,
                'units': drug.units,
                'am': dosage.am,
                'noon': dosage.noon,
                'pm': dosage.pm,
                'frequency': data.frequency
            }
        })
        this.fastTrackMedications = await Promise.all(withDosages)
    }

    async loadTreatmentState() {
        const params = { date: AppEncounterService.getSessionDate()}

        const req = await AppEncounterService.getJson(
            `programs/${AppEncounterService.getProgramID()}/patients/${this.patientID}/status`,
            params
        )

        if (req) this.treatmentState = req['status']
    }

    calculatePillsPerDay(am: number, noon: number, pm: number) {
        return parseFloat(am.toString()) + noon + pm
    }

    estimatePackSize(pillsPerDay: number, packSize=0) {
        const packs = (pillsPerDay * this.nextVisitInterval) / packSize
        
        let roundedPacks = Math.round(packs)

        if (roundedPacks <= 0) roundedPacks += 1

        return roundedPacks
    }

    calculateDosage(morningTabs: number, eveningTabs: number): number {
        let dose = 0
        if (eveningTabs === 0) dose = morningTabs

        if (morningTabs == 0) dose = eveningTabs

        if (morningTabs > 0 && eveningTabs  > 0) {
            dose = (morningTabs + eveningTabs) / 2
        }
        return dose
    }
    
    calculateEquivalentDosage(morningTabs: number, eveningTabs: number): number {
        return morningTabs + eveningTabs
    }

    calculateDateFromInterval() {
        const dateObj = new Date(RegimenService.getSessionDate())
        dateObj.setDate(dateObj.getDate() + this.nextVisitInterval)
        return HisDate.toStandardHisFormat(dateObj)
    }

    getDrugPackSize(drug: any) {
        if (drug.pack_size) return drug.pack_size
        try{
            return drug.barcodes[0].tabs
        }catch(e) {
            return 30
        }
    }

    getInstructions(drugName: string, morningTabs: number, eveningTabs: number, units: string): string {
        return `${drugName} :- Morning: ${morningTabs} ${units}, Evening: ${eveningTabs} ${units}`
    }

    toOrderObj(id: number, name: string, units: string, am=0, pm=0, frequency=''): DrugInterface {
        return {
            'drug_inventory_id': id,
            'equivalent_daily_dose': this.calculateEquivalentDosage(am, pm),
            'start_date': RegimenService.getSessionDate(),
            'auto_expire_date': this.calculateDateFromInterval(), 
            'units': units,
            'instructions': this.getInstructions(name, am, pm, units),
            'dose': this.calculateDosage(am, pm),
            'frequency': frequency
        }
    }

    async getReasonForRegimenSwitch() {
        const reason = await AppEncounterService.getFirstValueText(this.patientID, 'Reason for ARV switch')
        return reason ? reason : 'N/A'
    }

    async createDrugOrder(drugOrders: Array<DrugInterface>) {
        return DrugOrderService.create({
            'encounter_id': this.encounterID,
            'drug_orders': drugOrders
        })
    }

    async createHangingPillsObs(response: string) {
        return this.saveValueTextObs('appointment type', response)
    }

    async createRegimenSwitchObs(reasonForSwitch: string): Promise<Observation> {
        return this.saveValueTextObs('Reason for ARV switch', reasonForSwitch)
    }
}

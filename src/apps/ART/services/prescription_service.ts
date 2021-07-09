import { DrugInterface } from "@/interfaces/Drug";
import { Encounter } from "@/interfaces/encounter";
import { ConceptService } from "@/services/concept_service";
import { DrugOrderService } from "@/services/drug_order_service";
import { EncounterService } from "@/services/encounter_service";
import { Observation, ObservationService, ObsValue } from "@/services/observation_service";
import { isEmpty } from "lodash";
import HisDate from "@/utils/Date"
import { RegimenService } from "@/services/regimen_service";
import { find } from "lodash"

export const REGIMEN_SWITCH_REASONS = [
    'Policy change', 'Ease of administration (pill burden, swallowing)',
    'Drug drug interaction', 'Pregnancy intention',
    'Side effects', 'Treatment failure', 'Weight Change', 'Other'
]

export enum HangingPill {
   OPTIMIZE = 'Optimize - including hanging pills',
   EXACT = 'Exact - excluding hanging pills'
}

export class PrescriptionService extends RegimenService {
    patientID: number;
    encounterID: number;
    nextVisitInterval: number;
    fastTrack: boolean;
    useHangingPills: boolean;
    received3HP: boolean;
    regimenExtras: Array<Record<string, any>>;
    hangingPills: Array<Record<string, any>>;
    fastTrackMedications: Array<Record<string, any>>;
    constructor(patientID: number) {
        super()
        this.patientID = patientID
        this.encounterID = 0
        this.nextVisitInterval = 0
        this.fastTrack = false
        this.received3HP = false
        this.useHangingPills = false
        this.regimenExtras = []
        this.fastTrackMedications = []
        this.hangingPills = []
    }

    setNextVisitInterval(nextVisitInterval: number) {
        this.nextVisitInterval = nextVisitInterval
    }

    setEncounterID(encounterID: number) { this.encounterID = encounterID }

    getPatientRegimens() { return RegimenService.getRegimens(this.patientID) }

    getCustomIngridients() { return RegimenService.getCustomIngridients() }

    getFastTrackMedications() { return this.fastTrackMedications }

    isFastTrack() { return this.fastTrack }

    hasHangingPills(drugs: any) {
        let isHanging = false
        for(const index in drugs) {
            const drug = drugs[index]
            const filter = find(this.hangingPills, {
                drug: drug.drug_id, hasRemaining: true
            })
            if (filter) {
                isHanging = true
                break;
            }
        }
        return isHanging
    }

    async load3HpStatus() {
        const orders = await ConceptService.getConceptID('Medication orders')
        const req = await ObservationService.getObs({
            'person_id': this.patientID, 'concept_id': orders
        })
        
        if (!req) return

        const rifapentine = await ConceptService.getConceptID('Rifapentine')

        const receipt = req.filter((obs: ObsValue) => obs.value_coded === rifapentine)

        if (!isEmpty(receipt)) this.received3HP = true
    }

    async loadFastTrackStatus() {
        const fastTrack = await ConceptService.getConceptID('Fast track', true)
        const yes = await ConceptService.getConceptID('yes')
        const obs = await ObservationService.getObs({
            'person_id': this.patientID, 'concept_id': fastTrack
        })
        if (!isEmpty(obs) && obs[0].value_coded === yes) this.fastTrack = true
    }
    
    async loadRegimenExtras(date=RegimenService.getSessionDate()) {
        const meds = await RegimenService.getJson(
            `programs/${RegimenService.getProgramID()}/patients/${this.patientID}/dosages`,
            {date}
        )
        if (meds) this.regimenExtras = Object.values(meds)
    }

    async loadHangingPills() {
        const amountBrought = await ConceptService.getConceptID('Pills brought', true)
        const obs = await ObservationService.getObs({
            'person_id': this.patientID,
            'concept_id': amountBrought,
            'date': RegimenService.getSessionDate()
        })

        if (obs) this.hangingPills = obs.map((item: any)=> {
            try {
                return {
                    drug: item.order.drug_order.drug_inventory_id,
                    hasRemaining: item.value_numeric >= 1
                }
            }catch(e) {
                return { drug: 0, hasRemaining: false }
            }
        })
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

    getRegimenExtras() { return this.regimenExtras }

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

    getDrugFrequency(drugName: string): string {
        if (this.received3HP && drugName.match(/Rifapentine|Isoniazid/i)) {
            return 'Weekly (QW)'
        }
        return 'Daily (QOD)'
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
            'frequency': frequency || this.getDrugFrequency(name)
        }
    }

    async getReasonForRegimenSwitch() {
        const concept = await ConceptService.getConceptID('Reason for ARV switch', true)
        const obs = await ObservationService.getObs({
            'concept_id': concept, 'person_id': this.patientID, 'limit': 1
        })
        return !isEmpty(obs) ? obs[0].value_text : 'N/A'
    }

    async createDrugOrder(drugOrders: Array<DrugInterface>, encounterID=this.encounterID) {
        return DrugOrderService.create({
            'encounter_id': encounterID,
            'drug_orders': drugOrders
        })
    }

    async createTreatmentEncounter(): Promise<Encounter | undefined> {
        const encounter = await EncounterService.create({
            'patient_id': this.patientID,
            'encounter_type_id': 25, //TODO, get this from api or reference dictionary
        })

        if (!encounter) return

        this.encounterID = encounter.encounter_id

        return encounter
    }
    
    async createHangingPillsObs(response: HangingPill, encounterID=this.encounterID) {
        const appointmentType = await ObservationService.buildValueText(
            'Appointment type', response
        )
        return ObservationService.saveObs(encounterID, appointmentType)
    }
    
    async createRegimenSwitchObs(reasonForSwitch: string, encounterID=this.encounterID): Promise<Observation> {
        const regimenSwitch = await ObservationService.buildValueText(
            'Reason for ARV switch', reasonForSwitch
        )
        return ObservationService.saveObs(encounterID, regimenSwitch)
    }
}
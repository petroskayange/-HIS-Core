import { DrugInterface } from "@/interfaces/Drug";
import { Encounter } from "@/interfaces/encounter";
import { ConceptService } from "@/services/concept_service";
import { DrugOrderService } from "@/services/drug_order_service";
import { EncounterService } from "@/services/encounter_service";
import { Observation, ObservationService, ObsValue } from "@/services/observation_service";
import { isEmpty } from "lodash";
import HisDate from "@/utils/Date"
import { RegimenService } from "@/services/regimen_service";

export class PrescriptionService extends RegimenService {
    patientID: number;
    encounterID: number;
    nextVisitInterval: number;
    fastTrack: boolean;
    received3HP: boolean;
    regimenExtras: Array<Record<string, any>>;
    constructor(patientID: number) {
        super()
        this.patientID = patientID
        this.encounterID = 0
        this.nextVisitInterval = 0
        this.fastTrack = false
        this.received3HP = false
        this.regimenExtras = []
    }

    setNextVisitInterval(nextVisitInterval: number) {
        this.nextVisitInterval = nextVisitInterval
    }

    setEncounterID(encounterID: number) {
        this.encounterID = encounterID
    }

    getPatientRegimens() { return RegimenService.getRegimens(this.patientID) }

    getCustomIngridients() { return RegimenService.getCustomIngridients() }

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
        const fastTrack = await ConceptService.getConceptID('Fast track')
        const yes = await ConceptService.getConceptID('yes')
        const req = await ObservationService.getObs({
            'person_id': this.patientID, 'concept_id': fastTrack
        })

        if (!isEmpty(req) && req[0].value_coded === yes) this.fastTrack = true
    }
    
    async loadRegimenExtras(date=RegimenService.getSessionDate()) {
        const meds = await RegimenService.getJson(
            `programs/${RegimenService.getProgramID()}/patients/${this.patientID}/dosages`,
            {date}
        )
        if (meds) this.regimenExtras = Object.values(meds)
    }

    async getFastTrackMedications() {
        return DrugOrderService.getLastDrugsReceived(this.patientID)
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

    mapRegimenToDrug(regimen: any): DrugInterface {
        return {
            'drug_inventory_id': regimen.drug_id,
            'equivalent_daily_dose': this.calculateEquivalentDosage(regimen.am, regimen.pm),
            'start_date': RegimenService.getSessionDate(),
            'auto_expire_date': this.calculateDateFromInterval(), 
            'units': regimen.units,
            'instructions': this.getInstructions(regimen.drug_name, regimen.am, regimen.pm, regimen.units),
            'dose': this.calculateDosage(regimen.am, regimen.pm),
            'frequency': this.getDrugFrequency(regimen.drug_name)
        }
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

    async createRegimenSwitchObs(reasonForSwitch: string, encounterID=this.encounterID): Promise<Observation> {
        const regimenSwitch = await ObservationService.buildValueText(
            'Reason for ARV switch', reasonForSwitch
        )
        return ObservationService.saveObs(encounterID, regimenSwitch)
    }

    async createAppointmentObs(reason: string, encounterID=this.encounterID): Promise<Observation> {
        const appointment = await ObservationService.buildValueCoded(
            'Appointment type', reason
        )
        return ObservationService.saveObs(encounterID, appointment)
    }

    async createFastTrackAssessmentObs(fastTrackAnswer: string, encounterID=this.encounterID): Promise<Observation> {
        const fastTrack =  await ObservationService.buildValueCoded(
           'Assess for fast track', fastTrackAnswer
        )
        return ObservationService.saveObs(encounterID, fastTrack)
    }
}
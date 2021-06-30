import { DrugInterface } from "@/interfaces/Drug";
import { Encounter } from "@/interfaces/encounter";
import { ConceptService } from "@/services/concept_service";
import { DrugOrderService } from "@/services/drug_order_service";
import { EncounterService } from "@/services/encounter_service";
import { Observation, ObservationService } from "@/services/observation_service";
import { Service } from "@/services/service";
import { isEmpty } from "lodash";
import HisDate from "@/utils/Date"

export class PrescriptionService extends Service {
    patientID: number;
    encounterID: number;
    nextVisitInterval: number;
    fastTrack: boolean
    constructor(patientID: number) {
        super()
        this.patientID = patientID
        this.encounterID = 0
        this.nextVisitInterval = 0
        this.fastTrack = false
    }

    setNextVisitInterval(nextVisitInterval: number) {
        this.nextVisitInterval = nextVisitInterval
    }

    setEncounterID(encounterID: number) {
        this.encounterID = encounterID
    }

    async isFastTrack() {
        const fastTrack = await ConceptService.getConceptID('Fast track')
        const yes = await ConceptService.getConceptID('yes')
        const req = await ObservationService.getObs({
            'person_id': this.patientID, 'concept_id': fastTrack
        })
        return !isEmpty(req) ? req[0].value_coded === yes : null 
    }

    async getFastTrackMedications() {
        return DrugOrderService.getLastDrugsReceived(this.patientID)
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

    calcAutoExpireDateFromNextVisitInterval() {
        const dateObj = new Date(Service.getSessionDate())
        dateObj.setDate(dateObj.getDate() + this.nextVisitInterval)
        return HisDate.toStandardHisFormat(dateObj)
    }

    getInstructions(drugName: string, morningTabs: number, eveningTabs: number, units: string): string {
        return `${drugName} :- Morning: ${morningTabs} ${units}, Evening: ${eveningTabs} ${units}`
    }

    getDrugFrequency(): string {
        return 'Daily (QOD)'
    }

    mapRegimenToDrug(regimen: any): DrugInterface {
        return {
            'drug_inventory_id': regimen.drug_id,
            'equivalent_daily_dose': this.calculateEquivalentDosage(regimen.am, regimen.pm),
            'start_date': Service.getSessionDate(),
            'auto_expire_date': this.calcAutoExpireDateFromNextVisitInterval(), 
            'units': regimen.units,
            'instructions': this.getInstructions(regimen.drug_name, regimen.am, regimen.pm, regimen.units),
            'dose': this.calculateDosage(regimen.am, regimen.pm),
            'frequency': this.getDrugFrequency()
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
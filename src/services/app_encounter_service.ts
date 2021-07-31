import { ObservationService, ObsValue } from "@/services/observation_service"
import { EncounterService } from "@/services/encounter_service"
import { Encounter } from "@/interfaces/encounter"

export class AppEncounterService extends ObservationService {
    encounterTypeID: number;
    encounterID: number;
    patientID: number;
    date: string;
    constructor(patientID: number, encounterTypeID: number) {
        super()
        this.encounterTypeID = encounterTypeID
        this.patientID = patientID
        this.encounterID = 0
        this.date = ObservationService.getSessionDate()
    }

    getDate() {
        return this.date
    }

    setDate(date: string) {
        this.date = date
    }

    setEncounterID(encounterID: number) {
        this.encounterID = encounterID
    }

    getEncounterID() {
        return this.encounterID
    }
    
    buildValueText(conceptName: string, value: string) {
        return AppEncounterService.buildValueText(conceptName, value, this.date)
    }

    buildValueCoded(conceptName: string, value: string) {
        return AppEncounterService.buildValueCoded(conceptName, value, this.date)
    }

    buildValueNumber(conceptName: string, value: number, modifier=null, orderId: number | null = null) {
        return AppEncounterService.buildValueNumber(conceptName, value, modifier, orderId, this.date)
    }

    buildValueDate(conceptName: string, value: string) {
        return AppEncounterService.buildValueDate(conceptName, value, this.date)
    }

    async saveObservationList(obs: Array<ObsValue>) {
        return ObservationService.saveObsArray(this.encounterID, obs)
    }

    async saveValueTextObs(conceptName: string, value: string) {
        const obs: ObsValue = await ObservationService.buildValueText(
            conceptName, 
            value
        )
        return this.saveObs(obs)
    }

    async saveValueCodedObs(conceptName: string, value: string) {
        const obs: ObsValue = await ObservationService.buildValueCoded(
            conceptName, 
            value
        )
        return this.saveObs(obs)
    }

    async saveValueNumericObs(conceptName: string, value: number, modifier=null) {
        const obs: ObsValue = await ObservationService.buildValueNumber(
            conceptName, value, modifier
        )
        return this.saveObs(obs)
    }

    async saveValueDatetimeObs(conceptName: string, value: string) {
        const obs = await  ObservationService.buildValueDate(
            conceptName, value, ObservationService.getSessionDate()
        )
        return this.saveObs(obs)
    }

    async createEncounter():  Promise<Encounter | undefined>  {
        const encounter = await EncounterService.create({
            'encounter_type_id': this.encounterTypeID,
            'patient_id': this.patientID,
            'encounter_datetime': this.date
        })

        if (encounter) {
            this.encounterID = encounter.encounter_id
            return encounter
        } 
    }

    private saveObs(obs: ObsValue) {
        return AppEncounterService.saveObs(this.encounterID, obs)
    }
}
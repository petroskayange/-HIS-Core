import { Service } from '@/services/service'
import { EncounterService } from '@/services/encounter_service'

export class StagingService extends Service {
    patientID: number;
    encounterID: number;
    constructor(patientID: number) {
        super()
        this.encounterID = 0
        this.patientID = patientID
    }

    async createStagingEncounter() {
        const encounter = await EncounterService.create({
            'patient_id': this.patientID,
            'encounter_type_id': 52, //TODO, get this from api or reference dictionary
        })

        if (!encounter) return

        this.encounterID = encounter.encounter_id

        return encounter
    }
}
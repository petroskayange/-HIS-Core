import { AppEncounterService } from "@/services/app_encounter_service"

export class ClinicRegistrationService extends AppEncounterService {
    constructor(patientID: number) {
        super(patientID, 9) //TODO: Use encounter type reference name'
    }
}

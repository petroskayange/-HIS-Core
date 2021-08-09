import { AppEncounterService } from "@/services/app_encounter_service";

export class DispensationService extends AppEncounterService {
    constructor(patientID: number) {
        super(patientID, 54)
    }
}

import { AppEncounterService } from "@/services/app_encounter_service";
export class PatientTypeService extends AppEncounterService {
  constructor(patientID: number) {
    super(patientID, 5);
  }
}
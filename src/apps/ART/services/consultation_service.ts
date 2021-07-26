import { AppEncounterService } from "@/services/app_encounter_service";
export class ConsultationService extends AppEncounterService {
  constructor(patientID: number) {
    super(patientID, 53);
  }
  
}
import { AppEncounterService } from "@/services/app_encounter_service";

export class AppointmentService extends AppEncounterService {
  patientID: number;
  constructor(patientID: number) {
    super(patientID, 7);
    this.patientID = patientID;
  }

  async getNextAppointment() {
    const programID = AppEncounterService.getProgramID();
    const sessionDate = AppEncounterService.getSessionDate();
    return AppEncounterService.getJson(`/programs/${programID}/patients/${this.patientID}/next_appointment_date?date=${sessionDate}`)
  }
  static async getDailiyAppointments(date: any) {
    const programID = AppEncounterService.getProgramID();
    return AppEncounterService.getJson(`/programs/${programID}/booked_appointments?date=${date}&paginate=false`)
  }

}
import { AppEncounterService } from "@/services/app_encounter_service";

export class AppointmentService extends AppEncounterService {
  constructor(patientID: number) {
    super(patientID, 7);
  }

  async getNextAppointment() {
    const programID = AppEncounterService.getProgramID();
    return AppEncounterService.getJson(`/programs/${programID}/patients/${this.patientID}/next_appointment_date`, {date: this.date})
  }
  static async getDailiyAppointments(date: any) {
    const programID = AppEncounterService.getProgramID();
    return AppEncounterService.getJson(`/programs/${programID}/booked_appointments`, {date: date, paginate: false})
  }

}
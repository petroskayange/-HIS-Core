import { Service } from '@/services/service'
import Modal from "@/components/ApplicationModal.vue";
import ActivitiesModal from "@/components/ART/ActivitiesModal.vue";
import {
  modalController
} from "@ionic/vue";
export class ProgramService extends Service {
    constructor() {
        super()
    }

    static getProgramInformation(patientID: number) {
        return super.getJson(`/programs/${super.getProgramID()}/patients/${patientID}`);
    }
    
    static getNextTask(patientID: number) {
        return super.getJson(`/workflows/${super.getProgramID()}/${patientID}`, {date: super.getSessionDate()});
    }
    static getNextSuggestedARVNumber() {
    return super.getJson(`/programs/1/next_available_arv_number`);
      
    }
    static getFastTrackStatus(patientID: number) {
        return super.getJson('/on_fast_track', {'person_id': patientID, date: super.getSessionDate()});
    }
   static createPatient(personID: number) {
     return super.postJson(`/patients/`, {
          'program_id': super.getProgramID(),
          'person_id': personID
      })
    }
    static enrollPatient(personID: number) {
     return super.postJson(`/patients/${personID}/programs`, {
          'program_id': super.getProgramID(),
          'date_enrolled': super.getSessionDate()
      })
    }
    static getWeightForHeightValues() {
      return super.getJson('/patient_weight_for_height_values');
    }
    static async selectApplication() {
      const modal = await modalController.create({
        component: Modal,
        cssClass: "my-custom-class",
        backdropDismiss: false,
        componentProps: {
        },
      });
      modal.present()
      return modal;
    }
    static async selectTasks() {
      const modal = await modalController.create({
        component: ActivitiesModal,
        cssClass: "my-custom-class",
        backdropDismiss: false,
        componentProps: {
        },
      });
      modal.present();
      return modal;
    }
}
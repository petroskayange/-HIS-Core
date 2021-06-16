import { Service } from '@/services/service'
import router from '@/router/index';
import Modal from "@/components/ApplicationModal.vue";
import ActivitiesModal from "@/components/ART/ActivitiesModal.vue";
import {
  alertController,
  modalController
} from "@ionic/vue";
export class ProgramService extends Service {
    constructor() {
        super()
    }

    static getProgramInformation(patientID: number) {
        return super.getJson(`/programs/${super.programID}/patients/${patientID}`);
    }
    
    static getNextTask(patientID: number) {
        return super.getJson(`/workflows/${super.programID}/${patientID}`, {date: super.sessionDate});
    }
    
    static getFastTrackStatus(patientID: number) {
        return super.getJson('/on_fast_track', {'person_id': patientID, date: super.sessionDate});
    }
   static createPatient(personID: number) {
     return super.postJson(`/patients/`, {
          'program_id': super.programID,
          'person_id': personID
      })
    }
    static enrollPatient(personID: number) {
     return super.postJson(`/patients/${personID}/programs`, {
          'program_id': super.programID,
          'date_enrolled': super.sessionDate
      })
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
    static async showError(message: string) {
         const alert = await alertController
        .create({
          cssClass: 'my-custom-class',
        //   header: 'Patient not found',
          message: message,
          backdropDismiss: false,
          buttons: [
            {
              text: 'Home',
              handler: () => {
                router.push('/');
              },
            },
            {
              text: 'Back',
              handler: () => {
                router.back();
              },
            }
          ],
        });
      await alert.present();
    }
}
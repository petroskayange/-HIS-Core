import { Service } from '@/services/service'
import router from '@/router/index';
import {
  alertController,
} from "@ionic/vue";
export class ProgramService extends Service {
    constructor() {
        super()
    }

    static getProgramInformation(patientID: number) {
        return super.getJson(`/programs/${super.programID}/patients/${patientID}`);
    }
    
    static getNextTask(patientID: number) {
        return super.getJson(`/workflows/${super.programID}/${patientID}date=${super.sessionDate}`);
    }
    
    static getFastTrackStatus(patientID: number) {
        return super.getJson(`/on_fast_track?person_id=${patientID}&date=${super.sessionDate}`);
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
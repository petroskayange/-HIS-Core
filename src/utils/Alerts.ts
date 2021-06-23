import { toastController, alertController } from "@ionic/vue";

async function toast(message: string, color="primary", duration=6000) {
    const toast = await toastController.create({
        message: message,
        position: "top",
        animated: true,
        duration: duration,
        color: color
    });
    return toast.present();
}

export function toastWarning(message: string, duration=6000) {
    return toast(message, 'warning', duration)
}

export function toastSuccess(message: string, duration=6000) {
    return toast(message, 'success', duration)
}

export function toastDanger(message: string, duration=6000) {
    return toast(message, 'danger', duration)
}

export async function alertAction(message: string, buttons: any) {
    const alert = await alertController
   .create({
        cssClass: 'my-custom-class',
        mode: 'ios',
        message,
        backdropDismiss: false,
        buttons
   });
 await alert.present();
}
export async function alertConfirmation(message: string, header="Confirmation") {
    const alert = await alertController.create({
        cssClass: 'my-custom-class',
        mode: 'ios',
        header,
        message,
        backdropDismiss: false,
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
            },
            {
                text: 'Confirm'
            }
        ]
    })

   alert.present();

   const { role } = await alert.onDidDismiss()

   return role != 'cancel' 
}

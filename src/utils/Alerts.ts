import { toastController } from "@ionic/vue";

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


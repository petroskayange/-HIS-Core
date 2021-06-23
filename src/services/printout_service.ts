import { Service } from "./service";

export class PrintoutService extends Service {
    constructor() {
        super()
    }

    static printNationalID(patientId: number) {
        return this.printLb(`patients/${patientId}/labels/national_health_id`, `${patientId}-printout`)
    }

    private static async printLb(url: string, name='printout') {
        const file = await super.getText(url)

        if (!file) return

        const fileUrl = window.URL.createObjectURL(new Blob([file]))

        const link = document.createElement('a')
        link.href = fileUrl
        link.style.display = 'none'
        link.setAttribute('download', `${name}.lbl`)
        document.body.appendChild(link)

        link.click()
        return true
    }
}
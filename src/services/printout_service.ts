import { Service } from "./service";

export class PrintoutService extends Service {
    constructor() {
        super()
    }

    async printLbl(url: string, name=`printout-${Service.getSessionDate()}`) {
        const file = await Service.getText(url)

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
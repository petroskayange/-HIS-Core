import { PrintoutService } from "./printout_service";
import Url from "@/utils/Url";

export class PatientPrintoutService extends PrintoutService {
    patient: number
    baseUrl: string
    constructor(patientId: number){
        super()
        this.patient = patientId
        this.baseUrl = `patients/${this.patient}/labels/`
    }

    getLblUrl(resource: string, params = {} as Record<string, string>) {
        const urlParams = Url.parameterizeObjToString(params)
        return `${this.baseUrl}/${resource}?${urlParams}`
    }

    printPatientLbl(resource: string, params = {} as Record<string, string>) {
        return this.printLbl(this.getLblUrl(resource, params))
    }

    printFilingNumberLbl() {
        return this.printPatientLbl('filing_number')
    }

    printNidLbl() {
        return this.printPatientLbl('national_health_id')
    }

    printVisitSummaryLbl() {
        return this.printPatientLbl('visits', { date: PrintoutService.getSessionDate()})
    }

    printDemographicsLbl() {
        return this.printPatientLbl('patient_history')
    }

    printTransferOutLbl() {
        return this.printPatientLbl('transfer_out')
    }

}
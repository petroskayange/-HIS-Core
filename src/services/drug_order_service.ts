import { DrugOrderInterface } from "@/interfaces/DrugOrder";
import { Service } from "./service";

export class DrugOrderService extends Service {
    constructor() {
        super()
    }

    static create(orders: DrugOrderInterface) {
        return this.postJson('drug_orders', orders)
    }

    static getLastDrugsReceived(patientID: number) {
        return this.getJson(`patients/${patientID}/last_drugs_received`, {
            'date': this.getSessionDate(),
            'program_id': this.getProgramID()
        })
    }

    static getDrugDosages(patientID: number, drugID: number, date=this.getSessionDate()) {
        const params = { 'drug_id': drugID, 'date': date }
        return this.getJson(`programs/${this.getProgramID()}/patients/${patientID}/drug_doses`, params)
    }

    static getOrderByPatient(patientId: number, params: any) {
        return this.getJson('/drug_orders', {
            'patient_id': patientId,
            'program_id': super.getProgramID(),
            ...params
        })
    }

}
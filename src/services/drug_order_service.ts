import { DrugOrderInterface } from "@/interfaces/DrugOrder";
import { Service } from "./service";

export class DrugOrderService extends Service {
    constructor() {
        super()
    }

    static create(orders: DrugOrderInterface) {
        return this.postJson('drug_orders', orders)
    }

    static getLastDrugsReceived() {
        return this.getJson('last_drugs_received', {
            'date': this.getSessionDate(),
            'program_id': this.getProgramID()
        })
    }

    static getOrderByPatient(patientId: number, params: any) {
        return this.getJson('/drug_orders', {
            'patient_id': patientId,
            'program_id': super.getProgramID(),
            ...params
        })
    }

}
import { Service } from "./service";
import { DrugInterface } from "@/interfaces/Drug";
export class DrugOrderService extends Service {
    constructor() {
        super()
    }

    static create(orders: DrugInterface) {
        return this.postJson('drug_orders', orders)
    }

    static getOrderByPatient(patientId: number, params: any) {
        return this.getJson('/drug_orders', {
            'patient_id': patientId,
            'program_id': super.getProgramID(),
            ...params
        })
    }

}
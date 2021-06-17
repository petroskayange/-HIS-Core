import { Service } from "./service";

export class DrugOrderService extends Service {
    constructor() {
        super()
    }

    public static getOrderByPatient(patientId: number, params: any) {
        return this.getJson('/drug_orders', {
            'patient_id': patientId,
            'program_id': super.getProgramID(),
            ...params
        })
    }
}
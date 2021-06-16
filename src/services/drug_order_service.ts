import { Service } from "./service";

export class DrugOrderService extends Service {
    constructor() {
        super()
    }

    public static getOrderByPatient(patientId: number, date: string) {
        return this.getJson(`/drug_orders?patient_id=${patientId}&program_id=${super.programID}&start_date=${date}&paginate=false`)
    }
}
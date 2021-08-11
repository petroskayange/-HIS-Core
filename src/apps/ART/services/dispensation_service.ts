import { AppEncounterService } from "@/services/app_encounter_service";
import { DrugOrderService } from "@/services/drug_order_service";

export class DispensationService extends AppEncounterService {
    drugHistory: Array<any>;
    currentDrugOrder: Array<any>;
    
    constructor(patientID: number) {
        super(patientID, 54)
        this.drugHistory = []
        this.currentDrugOrder = []
    }

    getDrugHistory() {
        return this.drugHistory
    }

    getCurrentOrder() {
        return this.currentDrugOrder
    }

    async loadDrugHistory() {
        const res = await DrugOrderService.getDrugOrderHistory(this.patientID)
        if (res) {
            this.drugHistory = res
        }
    }

    async loadCurrentDrugOrder() {
        const res = await DrugOrderService.getDrugOrders(this.patientID)
        if (res) {
            this.currentDrugOrder = res
        }
    }
}

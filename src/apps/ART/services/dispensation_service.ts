import { AppEncounterService } from "@/services/app_encounter_service";
import { DrugOrderService } from "@/services/drug_order_service";

// ripped from old ART system
export const DRUG_PACK_SIZES: Record<string, any> = {
    '11': [ 30 ],
    '21': [ 25 ],
    '22': [ 60 ],
    '24': [ 30, 60, 90, 100 ],
    '30': [ 90 ],
    '39': [ 60 ],
    '73': [ 120 ],
    '74': [ 60 ],
    '76': [ 1000 ],
    '297': [ 30, 60, 90 ],
    '576': [ 30, 60, 90 ],
    '613': [ 60 ],
    '731': [ 60 ],
    '732': [ 60 ],
    '733': [ 60 ],
    '734': [ 30 ],
    '735': [ 30 ],
    '736': [ 60 ],
    '738': [ 60 ],
    '931': [ 30, 60, 90 ],
    '932': [ 30 ],
    '954': [ 60 ],
    '963': [ 30, 60, 90 ],
    '968': [ 60 ],
    '969': [ 30 ],
    '971': [ 30,60,90 ],
    '976': [ 60 ],
    '977': [ 30 ],
    '982': [ 30 ],
    '983': [ 30 ],
    '1039': [ 30,60,90 ],
    '1043': [ 60 ],
    '1044': [ 30],
    '1056': [ 24 ]
}


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

    getDrugPackSizes(drugId: number) {
        if (drugId in DRUG_PACK_SIZES) {
            return DRUG_PACK_SIZES[drugId]
        }
        return [30]
    }
}
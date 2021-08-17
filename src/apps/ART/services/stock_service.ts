import { Service } from "@/services/service";

export class StockService extends Service {
    constructor() {
        super()
    }

    static async fetchAvailableDrugStock(drugId: number) {
        const stock = await this.getJson('pharmacy/items', { 'drug_id': drugId })
        if (stock && stock.length > 0) {
            return stock.reduce((accum: number, pharm: any) => accum + pharm.current_quantity, 0);
        }
    }
}

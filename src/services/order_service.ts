import { Order } from '@/interfaces/order';
import { Service } from '@/services/service'
import HisDate from "@/utils/Date"
export class OrderService extends Service {
    constructor() {
        super()
    }

    static getOrders(patientID: number) {
        return super.getJson('/lab/orders', {'patient_id': patientID});
    }

    static getViralLoadOrders(orders: Order[]) {
       return orders.filter(order => {
        return order.tests.length > 0 && order.tests[0].result.length > 0;
       });
    }
    static formatOrders(order: Order) {
         const test = order.tests[0];
         const result = test.result[0];
         const resultDate = HisDate.toStandardHisFormat(result.date);
         return `${test.name} ${result.value_modifier}${result.value} ${resultDate}`;
    }
    
}
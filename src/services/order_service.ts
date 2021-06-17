import { Order } from '@/interfaces/order';
import { Service } from '@/services/service'
import HisDate from "@/utils/Date"
export class OrderService extends Service {
    constructor() {
        super()
    }

    static getOrders(patientID: number, params={}) {
        return super.getJson('/lab/orders', {
            'patient_id': patientID,
            ...params
        });
    }

    static getViralLoadOrders(orders: Order[]) {
        return orders.filter(order => {
            try {
                const result = order.tests[0].result;
                if (!Array.isArray(result)) return false
                return order.tests.length > 0 && order.tests[0].result.length > 0;
            } catch (error) {
                console.log(error);
            }

        });
    }
    static formatOrders(order: Order) {
        const test = order.tests[0];
        const result = test.result[0];
        const resultDate = HisDate.toStandardHisFormat(result.date);
        return `${test.name} ${result.value_modifier}${result.value} ${resultDate}`;
    }

}
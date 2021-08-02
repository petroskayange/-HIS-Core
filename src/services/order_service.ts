import { Order } from '@/interfaces/order';
import { Service } from '@/services/service'
import HisDate from "@/utils/Date"
export class OrderService extends Service {
    constructor() {
        super()
    }

    static getOrders(patientID: number, params = {}) {
        return super.getJson('/lab/orders', {
            'patient_id': patientID,
            ...params
        });
    }
    
    static getTestTypes() {
        return super.getJson('/lab/test_types');
    }
    
    static getSpecimens(testName: string) {
        return super.getJson('/lab/specimen_types', {'test_type': testName});
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

    static formatLabs(orders: Order[]) {
        const formatted = [];
        for (let x = 0; x < orders.length; x++) {
            const accessionNumber = orders[x].accession_number;
            const testStatus = (orders[x].specimen.name == "Unknown" ? "N/A" : orders[x].specimen.name);
            const dateOrdered = orders[x].order_date;
            const tests = orders[x].tests;

            for (let i = 0; i < tests.length; i++) {
                const results = (tests[i].result ? tests[i].result : []);
                const resultsArr = [];
                let resultDate = '';

                for (let r = 0; r < results.length; r++) {
                    resultDate = (results[r].date == null ? "" : `${results[r].date}`);
                    const name = results[r].indicator.name;
                    const value = results[r].value;
                    const valueModifier = results[r].value_modifier === '<' ? '&lt;' : results[r].value_modifier;
                    resultsArr.push(name + "   " + valueModifier + value);
                }
                formatted.push({
                    'accession_number': accessionNumber,
                    'test_name': tests[i].name,
                    specimen: testStatus,
                    ordered: HisDate.toStandardHisFormat(dateOrdered),
                    result: resultsArr,
                    released: HisDate.toStandardHisFormat(resultDate)
                })

            }
        }
        return formatted;
    }


}
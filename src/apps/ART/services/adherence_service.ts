import { AppEncounterService } from "@/services/app_encounter_service"
import HisDate from "@/utils/Date"
import { DrugInterface } from "@/interfaces/Drug"
import { DrugOrderService } from "@/services/drug_order_service"

export class AdherenceService extends AppEncounterService {
    lastDrugs: Array<DrugInterface>
    constructor(patientID: number) {
        super(patientID, 68) //TODO: Use encounter type reference name
        this.lastDrugs = []
    }

    async loadPreviousDrugs() {
        const drugs = await DrugOrderService.getLastDrugsReceived(this.patientID)
        let startDate = ''

        if (!drugs) return

        this.lastDrugs = drugs.filter((drug: DrugInterface) => {
            if (!startDate) {
                startDate = drug.start_date
                return true
            }
            return new Date(drug.start_date) >= new Date(startDate)
        })
    }

    getLastDrugs() { return this.lastDrugs }

    buildPillCountObs(orderId: number, pillCount: number) {
        return this.buildValueNumber('Number of tablets brought to clinic', pillCount, null, orderId)
    }

    async buildAdherenceObs(orderId: number, drugId: number, adherence: number) {
        const concept = await AppEncounterService.getConceptID('Drug adherence', true)
        return {
            'concept_id': concept,
            'value_numeric': adherence,
            'value_drug': drugId,
            'value_modifier': '%',
            'order_id': orderId,
            'person_id': this.patientID,
            'obs_datetime': AppEncounterService.getSessionDate()
        }
    }

    isAdherenceGood(adherence: number) {
        return adherence >= 95 && adherence <= 105
    }

    calculateAdherence(given: number, pills: number, expected: number) {
        return Math.round(100 * (given - pills) / (given - expected));
    }

    calculateExpected(given: number, equivalentDailyDose: number, startDate: string) {
        const daysGone = HisDate.dateDiffInDays(startDate, AppEncounterService.getSessionDate());

        return (given - (daysGone * parseFloat(equivalentDailyDose.toString())));
    }
}

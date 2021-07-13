import { AppEncounterService } from "@/services/app_encounter_service"
import HisDate from "@/utils/Date"
export class AdherenceService extends AppEncounterService {
    constructor(patientID: number) {
        super(patientID, 68) //TODO: Use encounter type reference name
    }

    calculateAdherence(given: number, pills: number, expected: number) {
        return Math.round(100 * (given - pills) / (given - expected));
    }

    calculateExpected(given: number, equivalentDailyDose: number, startDate: string) {
        const daysGone = HisDate.dateDiffInDays(startDate, AppEncounterService.getSessionDate());

        return (given - (daysGone * parseFloat(equivalentDailyDose.toString())));
    }
}

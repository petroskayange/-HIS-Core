import { AppEncounterService } from "@/services/app_encounter_service"
import { LocationService } from "@/services/location_service"

export enum StagingCategory {
    ADULT_STAGE_4 = 'stage_4_conditions_adults',
    ADULT_STAGE_3 = 'stage_3_conditions_adults',
    ADULT_STAGE_2 = 'stage_2_conditions_adults',
    ADULT_STAGE_1 = 'stage_1_conditions_adults',
    PEDAID_STAGE_4 = 'stage_4_conditions_pedaids',
    PEDAID_STAGE_3 = 'stage_3_conditions_pedaids',
    PEDAID_STAGE_2 = 'stage_2_conditions_pedaids',
    PEDAID_STAGE_1 = 'stage_1_conditions_pedaids'
}

export class StagingService extends AppEncounterService {
    gender: 'M' | 'F';
    ageInMonths: number;
    ageInYears: number;
    confirmatoryTest: string | null;
    stagingConditions: Array<any>;
    constructor(patientID: number, age: number, gender: 'M' | 'F') {
        super(patientID, 52) //TODO: Use encounter type reference name
        this.gender = gender
        this.ageInYears = age
        this.ageInMonths = age * 12
        this.confirmatoryTest = null
        this.stagingConditions = []
    }

    isMale() { return this.gender === 'M'}

    isFemale() { return this.gender === 'F' }

    isAdult() { return this.ageInYears >= 15 }

    isPedaid() { return this.ageInYears <= 14 }

    getFacilities (filter='') { return LocationService.getFacilities({name: filter}) }
    
    getStagingConditions(stage: StagingCategory) {
        return AppEncounterService.getConceptsByCategory(stage)
    }

    cd4CountIsValid(value: string) {
        try {
            return value.match(/^(=|<|>)([0-9]*)$/m) ? true : false
        }catch(e) {
            return false
        }
    }

    async loadHivConfirmatoryTestType() {
        const test = await AppEncounterService.getFirstValueCoded(
            super.patientID, 'Confirmatory hiv test type'
        )
        if (test) this.confirmatoryTest = test
    }
}

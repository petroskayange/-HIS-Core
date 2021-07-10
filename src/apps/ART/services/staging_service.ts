import { Service } from '@/services/service'
import { EncounterService } from '@/services/encounter_service'
import { ConceptService } from "@/services/concept_service";
import { ObservationService, ObsValue } from "@/services/observation_service";

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

export class StagingService extends Service {
    patientID: number;
    encounterID: number;
    gender: 'M' | 'F';
    ageInMonths: number;
    confirmatoryTest: string | null;
    stagingConditions: Array<any>;
    constructor(patientID: number, age: number, gender: 'M' | 'F') {
        super()
        this.encounterID = 0
        this.patientID = patientID
        this.gender = gender
        this.ageInMonths = age * 12
        this.confirmatoryTest = null
        this.stagingConditions = []
    }

    isMale() { return this.gender === 'M'}

    isFemale() { return this.gender === 'F' }

    async loadStagingConditions(stage: StagingCategory) {
        return ConceptService.getConceptsByCategory(stage)
    }

    async loadHivConfirmatoryTestType() {
        const test = await ObservationService.getFirstValueCoded(
            this.patientID, 'Confirmatory hiv test type'
        )
        if (test) this.confirmatoryTest = test
    }

    async createObs(obs: Array<ObsValue>) {
        return ObservationService.saveObsArray(this.encounterID, obs)
    }

    async createStagingEncounter() {
        const encounter = await EncounterService.create({
            'patient_id': this.patientID,
            'encounter_type_id': 52, //TODO, get this from api or reference dictionary
        })

        if (!encounter) return

        this.encounterID = encounter.encounter_id

        return encounter
    }
}
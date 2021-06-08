import {Service} from "@/services/service"

export interface NewEncounter {
    encounter_type_id: number;
    patient_id: number;
    program_id: number;
    encounter_datetime: string;
    encounter_type_name?: string;
}

export class EncounterService extends Service {
    encounter: NewEncounter

    constructor(data: NewEncounter) {
        super()
        this.encounter = data
    }

    create() {
        return Service.postJson('/encounters', this.encounter)
    }
}

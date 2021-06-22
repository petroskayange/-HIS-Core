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

    static voidEncounter(encounterId: number, reason='Unknown') {
        return super.void(`/encounters/${encounterId}`, {reason})
    }

    static getEncounters(patientId: number, params={}) {
        return super.getJson('/encounters', {
            'program_id': super.getProgramID(),
            'patient_id': patientId,  
            paginate: false,
            ...params
        })
    }
}

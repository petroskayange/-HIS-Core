import {Service} from "@/services/service"

export interface NewEncounter {
    encounter_type_id: number;
    patient_id: number;
    program_id?: number;
    encounter_datetime?: string;
    encounter_type_name?: string;
}

export class EncounterService extends Service {
    constructor() {
        super()
    }

    static create(encounter: NewEncounter) {
        const data = {...encounter}

        if (!('program_id' in data)) 
            Object.assign(data, {'program_id': this.getProgramID()})

        if (!('encounter_datetime' in data)) 
            Object.assign(data, {'encounter_datetime': this.getSessionDate()})
        
        return Service.postJson('/encounters', data)
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

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

    public static getEncountersByDate(patientId: number, date='') {
        return super.getJson(`/encounters?paginate=false&patient_id=${patientId}&date=${date}&program_id=${super.programID}`)
    }
}

import { Service } from './service'

export interface ObsValue {
    concept_id: number;
    value_text?: string;
    value_coded?: number;
    value_datetime?: string;
    value_boolean?: string;
    obs_datetime?: string;
}

export interface Observation {
    encounter_id: number;
    observations: Array<ObsValue>;
}

export class ObservationService extends Service {
    constructor() {
        super()
    }

    static create(data: Observation) {
        return super.postJson('/observations', data)     
    }
    
    // Deprecated: use getObs instead
    static getObservations(patientID: number, conceptID: number) {
        return super.getJson(`/observations?person_id=${patientID}&concept_id=${conceptID}`)
    }

    static getObs(params: Record<string, string>) {
        return super.getJson('/observations', params)
    } 
}

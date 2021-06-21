import { ConceptService } from './concept_service'
import HisDate from '@/utils/Date'

export interface ObsValue {
    concept_id: number;
    value_text?: string;
    value_coded?: number;
    value_datetime?: string;
    value_modifier?: string;
    value_boolean?: string;
    value_numeric?: number;
    obs_datetime?: string;
}

export interface Observation {
    encounter_id: number;
    observations: Array<ObsValue>;
}

export class ObservationService extends ConceptService {
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

    static async resolvePrimaryValue(obs: any) {
        let value: string | number = ''

        if (obs.value_datetime) {
            value = HisDate.toStandardHisDisplayFormat(obs.value_datetime)
        }

        if (obs.value_text) {
            value = obs.value_text
        }
        
        if (obs.value_numeric) {
            value = obs.value_numeric
        }

        if (obs.value_coded) {
            value = await super.getConceptName(obs.value_coded)
            console.log(value)
        }

        if (obs.value_modifier) {
            value = `${value} ${obs.value_modifier}`
        }

        return value
    }
}

import ApiClient from './api_client'

export interface ObsValue {
    concept_id: number;
    value_text?: string;
    value_coded?: number;
    value_datetime?: string;
    value_boolean?: string;
    obs_datetime?: string;
}

export interface Observation {
    encounter_id: number,
    observations: Array<ObsValue>,
}

export async function createObservation(data: Observation) {
    const req = await ApiClient.post('/observations', data)
    
    if (req && req.ok) return req?.json()

    throw 'Unable to save Observations'
}
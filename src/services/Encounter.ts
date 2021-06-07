import ApiClient from "./api_client"

export interface Encounter {
    encounter_type_id: number;
    patient_id: number;
    program_id: number;
    encounter_datetime: string;
    encounter_type_name?: string;
}

export async function createEncounter(data: Encounter) {
    const req = await ApiClient.post('/encounters', data)
    
    if (req && req.ok) return req?.json()

    throw 'Unable to save Encounter'
}

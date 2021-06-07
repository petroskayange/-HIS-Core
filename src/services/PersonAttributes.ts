import ApiClient from './api_client'

export interface PersonAttribute {
    person_attribute_type_id: number,
    value: number | string
}

export async function createAttributes(data: Array<PersonAttribute>) {
    const req = await ApiClient.post('/person_attributes', data)
    
    if (req && req.ok) return req?.json()

    throw 'Unable to save person attributes'
}

import ApiClient from './api_client'

export interface PersonAttributes {
    person_attribute_type_id: number,
    value: number | string
}

export async function createAttributes(data: Array<PersonAttributes>) {
    const req = await ApiClient.post('/person_attributes', data)
    
    if (req && req.ok) return req?.json()

    throw 'Unable to save person attributes'
}

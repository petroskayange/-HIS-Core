import ApiClient  from "./api_client";

export interface PersonInterface {
    given_name: string;
    family_name: string;
    gender: string;
    birthdate: string;
    birthdate_estimated: boolean;
    home_district: string;
    home_traditional_authority: string;
    home_village: string;
    current_district: string;
    current_traditional_authority: string;
    current_village: string;
    landmark: string;
    cell_phone_number: string;
    occupation: string;
    facility_name: string;
    patient_type?: string;
    relationship?: string;
}

async function get(url: string) {
    const req = await ApiClient.get(url)
    return req?.json()
}

export async function createPerson(data: PersonInterface) {
    const req = await ApiClient.post('/people', data)
    
    if (req && req.ok) return req?.json()

    throw 'Unable to save person'
}

export function searchFamilyName(familyName: string): any {
    return get(`/search/family_name?search_string=${familyName}`)
} 

export function searchGivenName(givenName: string): any {
    return get(`/search/given_name?search_string=${givenName}`)
}

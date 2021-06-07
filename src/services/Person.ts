import ApiClient  from "./api_client";

async function get(url: string) {
    const req = await ApiClient.get(url)
    return req?.json()
}

function searchFamilyName(familyName: string): any {
    return get(`/search/family_name?search_string=${familyName}`)
} 

function searchGivenName(givenName: string): any {
    return get(`/search/given_name?search_string=${givenName}`)
}

export default {
    searchFamilyName,
    searchGivenName
}
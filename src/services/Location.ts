import ApiClient from './api_client'

async function get(url: string) {
    const req = await ApiClient.get(url)
    return req?.json()
}

export async function getFacilities() {
    return get('/locations?name=')
}

export async function getRegions() {
    return get('/regions')
}

export async function getDistricts(filter='') {
    return get(`/districts?region_id=${filter}`)
}

export async function getTAs(filter='') {
    return get(`/traditional_authorities?district_id=${filter}`)
}

export async function getVillages(filter='') {
    return get(`/villages?traditional_authority_id=${filter}`)
}
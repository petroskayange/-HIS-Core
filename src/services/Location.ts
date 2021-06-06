import ApiClient from './api_client'

async function get(url: string) {
    const req = await ApiClient.get(url)
    return req?.json()
}

async function getRegions() {
    return get('/regions')
}

async function getDistricts(filter='') {
    return get(`/districts?region_id=${filter}`)
}

async function getTAs(filter='') {
    return get(`/traditional_authorities?district_id=${filter}`)
}

async function getVillages(filter='') {
    return get(`/villages?traditional_authority_id=${filter}`)
}


export default  {
    getRegions,
    getDistricts,
    getTAs,
    getVillages
}
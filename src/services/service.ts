import ApiClient from "./api_client"

export class Service {
    static programID = sessionStorage.programID;
    static sessionDate = sessionStorage.sessionDate;
    static async getJson(url: string) {
        const req = await ApiClient.get(url)

        if (req && req.ok) return req?.json()
    }

    static async postJson(url: string, data: any, genericError='Unable to save record') {
        const req = await ApiClient.post(url, data)
    
        if (req && req.ok) return req?.json()

        throw genericError
    }   
}

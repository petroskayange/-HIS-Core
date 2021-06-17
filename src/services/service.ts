import ApiClient from "./api_client"
import Url from "@/utils/Url"

export class Service {
    static async getJson(url: string, params = {} as Record<string, any>) {
        const transformedUrl = `${url}?${Url.parameterizeObjToString(params)}`
        const req = await ApiClient.get(transformedUrl)

        if (req && req.ok) return req?.json()
    }
    
    static async postJson(url: string, data: any, genericError='Unable to save record') {
        const req = await ApiClient.post(url, data)
    
        if (req && req.ok) return req?.json()

        throw genericError
    }

    static getUserLocation() {
        return sessionStorage.getItem('userLocation')
    }

    static getSessionDate() {
        return sessionStorage.getItem('sessionDate') || '';
    }
    
    static getProgramID() {
        return sessionStorage.getItem('programID');
    }
    
    static getApplicationImage() {
        return sessionStorage.getItem('applicationImage')
    }

    static getApplicationName() {
        return sessionStorage.getItem('applicationName')
    }
    
    static getUserRoles() {
       const roles = sessionStorage.getItem('userRoles');
       
       if (roles) return JSON.parse(roles)
    }

    static setUserLocation(name: string) {
        sessionStorage.setItem('userLocation', name)
    }
    
    static setSessionDate(date: string) {
        sessionStorage.setItem('sessionDate', date);
    }
    
    static setProgramID(id: string) {
        sessionStorage.setItem('programID', id);
    }
    
    static setApplicationImage(url: string) {
        sessionStorage.setItem('applicationImage', url)
    }

    static setApplicationName(name: string) {
        sessionStorage.setItem('applicationName', name)
    }
    
    static setUserRoles(roles: any) {
        sessionStorage.setItem('userRoles', JSON.stringify(roles))
    }
}

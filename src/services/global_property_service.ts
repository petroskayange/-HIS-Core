import { Service } from "./service";

export class GlobalPropertyService extends Service {
    constructor() {
        super()
    }

    static async get(prop: string) {
        const res = await super.getJson('global_properties', { property: prop })

        if (res && prop in res) return res[prop]
    }

    static set(prop: string, val: string | number) {
        return super.postJson('global_properties', {
            'property': prop, 
            'property_value': val 
        })   
    }

    static getSitePrefix() { return this.get('site_prefix') }

    static getSiteUUID() { return this.get('site_uuid') }

    static getCurrentHealthCenterId() { return this.get('current_health_center_id') }

    static isMilitarySite() { return this.get('military.enabled') }
    static isHTNEnabled() { return this.get('activate.htn.enhancement') }
    static getAppointmentLimit() { return this.get('clinic.appointment.limit') }
}
import SiteCode from "@/components/SetSiteCode.vue"
import ClinicDays from "@/components/SetClinicDays.vue"
import HtnAge from "@/components/SetHTNAge.vue"
import AppointmentLimit from "@/components/SetAppointmentLimit.vue"

// Reference names for BaseFormComponents
export enum FieldType {
    TT_SET_SITE_CODE="site-code"
}
// Components to be rendered
export const BasePrefernceComponents = {
    SiteCode: SiteCode,
    ClinicDays: ClinicDays,
    HtnAge: HtnAge,
    AppointmentLimit: AppointmentLimit
}
import { Option } from "@/components/Forms/FieldInterface";
import { ENCOUNTERS } from "./tasks/encounters";
import { OTHER_TASKS, PREFERENCES } from "./tasks/other";
import { AppInterface } from "../interfaces/AppInterface";
import PatientAlerts from "@/services/patient_alerts";
import appRoutes from "./routes"
import {BasePrefernceComponents} from '@/apps/OPD/preferences'
const BASE_URL_PATH = '/assets/images/'

function img(image: string) { return `${BASE_URL_PATH}${image}` }

const OPD: AppInterface = {
    programID: 14,
    applicationName: 'OPD',
    applicationIcon: img('opd.png'),
    applicationDescription: "Outpatient Program",
    appRoutes,
    patientDashboard: {
        tasks: {
            encounters: ENCOUNTERS,
            other: OTHER_TASKS
        },
        async alerts(patientId: number): Promise<Option[]> {
            const sideEffects = await PatientAlerts.alertSideEffects(patientId)
            return [
                { label: `Patient has ${sideEffects.length} side effects`, value: ''}
            ]
        },
        programCardInfo(data: any): Array<Option> {
            return  [
                { label: "OPD- Start Date", value: data.art_start_date},
                { label: "ARV Number", value: `${data.arv_number} | Regimen: ${data.current_regimen}` },
                { label: "File Number", value: data.filing_number.number},
                { label: "Current Outcome", value: data.current_outcome},
            ]
        }
    },
    activities: [
        { value: "Vitals", selected: false },
        { value: "Presenting complaints", selected: false },
        { value: "Outpatient diagnosis", selected: false },
        { value: "Prescription", selected: false },
       
    ],
    preferences: PREFERENCES,
    preferenceComponents: BasePrefernceComponents

}
export default OPD 
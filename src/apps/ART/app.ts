import { Option } from "@/components/Forms/FieldInterface";
import { ENCOUNTERS } from "./tasks/encounters";
import { OTHER_TASKS, PREFERENCES } from "./tasks/other";
import { AppInterface } from "../interfaces/AppInterface";
import PatientAlerts from "@/services/patient_alerts";
import appRoutes from "./routes"
import {BasePrefernceComponents} from '@/apps/ART/preferences'
const BASE_URL_PATH = '/assets/images/'

function img(image: string) { return `${BASE_URL_PATH}${image}` }

const ART: AppInterface = {
    programID: 1,
    applicationName: 'ART',
    applicationIcon: img('aids.png'),
    applicationDescription: "Application for HIV testing",
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
                { label: "ART- Start Date", value: data.art_start_date},
                { label: "ARV Number", value: `${data.arv_number} | Regimen: ${data.current_regimen}` },
                { label: "File Number", value: data.filing_number.number},
                { label: "Current Outcome", value: data.current_outcome},
            ]
        }
    },
    activities: [
        { value: "ART adherence", selected: false },
        { value: "HIV clinic consultations", selected: false },
        { value: "HIV first visits", selected: false },
        { value: "HIV reception visits", selected: false },
        { value: "HIV staging visits", selected: false },
        { value: "Manage Appointments", selected: false },
        { value: "Drug Dispensations", selected: false },
        { value: "Prescriptions", selected: false },
        { value: "Vitals", selected: false }
    ],
    preferences: PREFERENCES,
    preferenceComponents: BasePrefernceComponents

}
export default ART 
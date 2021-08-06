import Prescription from "@/apps/ART/views/encounters/Prescription.vue"
import Registration from "@/apps/ART/views/encounters/Registration.vue"
import Appointments from "@/apps/ART/views/encounters/Appointment.vue"
import Adherence from "@/apps/ART/views/encounters/Adherence.vue"
import Consultation from "@/apps/ART/views/encounters/Consultation.vue"
import Dispensing from "@/apps/ART/views/encounters/Dispensing.vue"
import Reception from "@/apps/ART/views/encounters/Reception.vue"
import Staging from "@/apps/ART/views/encounters/Staging.vue"
import Vitals from "@/apps/ART/views/encounters/Vitals.vue"
import PatientType from "@/apps/ART/views/encounters/PatientType.vue"
import FastTrack from "@/apps/ART/views/encounters/FastTrack.vue"

export default [
    {
        name: "Treatment",
        path: "/art/encounters/prescriptions/:patient_id",
        component: Prescription
    },
    {
        name: "ART adherence",
        path: "/art/encounters/adherence/:patient_id",
        component: Adherence
    },
    {
        name: "HIV clinic consultations",
        path: "/art/encounters/consultation/:patient_id",
        component: Consultation
    },
    {
        name: "Hiv clinic registration",
        path: "/art/encounters/registration/:patient_id",
        component: Registration
    },
    {
        name: "HIV reception",
        path: "/art/encounters/reception/:patient_id",
        component: Reception
    },
    {
        name: "HIV staging",
        path: "/art/encounters/staging/:patient_id",
        component: Staging
    },
    {
        name: "Manage Appointments",
        path: "/art/encounters/appointment/:patient_id",
        component: Appointments
    },
    {
        name: "Drug Dispensations",
        path: "/art/encounters/dispensation/:patient_id",
        component: Dispensing
    },
    {
        name: "Vitals",
        path: "/art/encounters/vitals/:patient_id",
        component: Vitals
    },
    {
        name: "Patient Type",
        path: "/art/encounters/patient_type/:patient_id",
        component: PatientType
    },
    {
        name: "Fast Track",
        path: "/art/encounters/fast_track/:patient_id",
        component: FastTrack
    }
]
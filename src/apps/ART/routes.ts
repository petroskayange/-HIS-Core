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
        path: "/art/encounters/prescriptions",
        component: Prescription
    },
    {
        name: "ART adherence",
        path: "/art/encounters/adherence",
        component: Adherence
    },
    {
        name: "HIV clinic consultations",
        path: "/art/encounters/consultation",
        component: Consultation
    },
    {
        name: "Hiv clinic registration",
        path: "/art/encounters/registration",
        component: Registration
    },
    {
        name: "HIV reception",
        path: "/art/encounters/reception",
        component: Reception
    },
    {
        name: "HIV staging",
        path: "/art/encounters/staging",
        component: Staging
    },
    {
        name: "Manage Appointments",
        path: "/art/encounters/appointment",
        component: Appointments
    },
    {
        name: "Drug Dispensations",
        path: "/art/encounters/dispensation",
        component: Dispensing
    },
    {
        name: "Vitals",
        path: "/art/encounters/vitals",
        component: Vitals
    },
    {
        name: "Patient Type",
        path: "/art/encounters/patient_type",
        component: PatientType
    },
    {
        name: "Fast Track",
        path: "/art/encounters/fast_track",
        component: FastTrack
    }
]
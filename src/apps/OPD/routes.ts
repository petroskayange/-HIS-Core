import Prescription from "@/apps/OPD/views/encounters/Prescription.vue"
import Registration from "@/apps/OPD/views/encounters/Registration.vue"
import Appointments from "@/apps/OPD/views/encounters/Appointment.vue"
import Adherence from "@/apps/OPD/views/encounters/Adherence.vue"
import Consultation from "@/apps/OPD/views/encounters/Consultation.vue"
import Dispensing from "@/apps/OPD/views/encounters/Dispensing.vue"
import Reception from "@/apps/OPD/views/encounters/Reception.vue"
import Staging from "@/apps/OPD/views/encounters/Staging.vue"
import Vitals from "@/apps/OPD/views/encounters/Vitals.vue"
import PatientType from "@/apps/OPD/views/encounters/PatientType.vue"
import FastTrack from "@/apps/OPD/views/encounters/FastTrack.vue"

export default [
    {
        name: "treatment",
        path: "/opd/encounters/prescriptions/:patient_id",
        component: Prescription
    },
    {
        name: "opd adherence",
        path: "/opd/encounters/adherence/:patient_id",
        component: Adherence
    },
    {
        name: "hiv clinic consultation",
        path: "/opd/encounters/consultation/:patient_id",
        component: Consultation
    },
    {
        name: "hiv clinic registration",
        path: "/opd/encounters/registration/:patient_id",
        component: Registration
    },
    {
        name: "hiv reception",
        path: "/opd/encounters/reception/:patient_id",
        component: Reception
    },
    {
        name: "hiv staging",
        path: "/opd/encounters/staging/:patient_id",
        component: Staging
    },
    {
        name: "appointment",
        path: "/opd/encounters/appointment/:patient_id",
        component: Appointments
    },
    {
        name: "dispensing",
        path: "/opd/encounters/dispensation/:patient_id",
        component: Dispensing
    },
    {
        name: "vitals",
        path: "/opd/encounters/vitals/:patient_id",
        component: Vitals
    },
    {
        name: "htn_vitals",
        path: "/opd/encounters/vitals/:patient_id",
        component: Vitals
    },
    {
        name: "patient type",
        path: "/opd/encounters/patient_type/:patient_id",
        component: PatientType
    },
    {
        name: "fast track assesment",
        path: "/opd/encounters/fast_track/:patient_id",
        component: FastTrack
    }
]
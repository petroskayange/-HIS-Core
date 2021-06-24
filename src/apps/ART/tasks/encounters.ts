import { TaskInterface } from "../../interfaces/TaskInterface"

const BASE_URL_PATH = '/assets/images/'

function img(image: string) { return `${BASE_URL_PATH}${image}` }

export const ENCOUNTERS: Array<TaskInterface> = [
  {
    id: "art adherence",
    name: "ART adherence",
    url: "/encounters/art/adherence",
    icon: img("adherence.png")
  },
  {
    id: "hiv clinic consultation",
    name: "HIV clinic consultations",
    url: "/encounters/art/consultation",
    icon: img("consultation.png")
  },
  {
    id: "hiv clinic registration",
    name: "HIV first visits",
    url: "/encounters/art/clinic_registration",
    icon: img("registration.png")
  },
  {
    id: "hiv reception",
    name: "HIV reception visits",
    url: "/encounters/art/reception",
    icon: img("reception.png")
  },
  {
    id: "hiv staging",
    name: "HIV staging visits",
    url: "/encounters/art/staging",
    icon: img("hiv-staging.png")
  },
  {
    id: "appointment",
    name: "Manage Appointments",
    url: "/encounters/art/appointment",
    icon: img("appointment.png")
  },
  {
    id: "dispensing",
    name: "Drug Dispensations",
    url: "/encounters/art/dispensation",
    icon: img("dispensing.png")
  },
  {
    id: "treatment",
    name: "Prescriptions",
    url: "/encounters/art/treatment",
    icon: img("prescription.png")
  },
  {
    id: "vitals",
    name: "Vitals",
    url: "/encounters/art/vitals",
    icon: img("vitals.png")
  }
]
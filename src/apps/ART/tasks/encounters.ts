import { TaskInterface } from "../../interfaces/TaskInterface"

const BASE_URL_PATH = '/assets/images/'

function img(image: string) { return `${BASE_URL_PATH}${image}` }

export const ENCOUNTERS: Array<TaskInterface> = [
  {
    id: "art adherence",
    name: "ART adherence",
    icon: img("adherence.png")
  },
  {
    id: "hiv clinic consultation",
    name: "HIV clinic consultations",
    icon: img("consultation.png")
  },
  {
    id: "hiv clinic registration",
    name: "Hiv clinic registration",
    icon: img("registration.png")
  },
  {
    id: "hiv reception",
    name: "HIV reception",
    icon: img("reception.png")
  },
  {
    id: "hiv staging",
    name: "HIV staging",
    icon: img("hiv-staging.png")
  },
  {
    id: "appointment",
    name: "Manage Appointments",
    icon: img("appointment.png")
  },
  {
    id: "dispensing",
    name: "Drug Dispensations",
    icon: img("dispensing.png")
  },
  {
    id: "treatment",
    name: "Treatment",
    icon: img("prescription.png")
  },
  {
    id: "vitals",
    name: "Vitals",
    icon: img("vitals.png")
  },
  {
    id: "patient type",
    name: "Patient Type",
    icon: img("patient-type.png")
  },
  {
    id: "fast track",
    name: "Fast Track",
    icon: img("fast-track.png")
  }
]
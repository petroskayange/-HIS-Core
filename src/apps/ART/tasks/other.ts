import { TaskInterface } from "../../interfaces/TaskInterface"
import { PatientPrintoutService } from "@/services/patient_printout_service"

const BASE_URL_PATH = '/assets/images/'

function img(image: string) { return `${BASE_URL_PATH}${image}` }

export const OTHER_TASKS: Array<TaskInterface> = [
  {
    id: "npid",
    name: "National Health ID (Print)",
    description: "Print Patient National Health ID",
    action({ patient }: any) {
      const lbl = new PatientPrintoutService(patient.getID())
      return lbl.printNidLbl()
    },
    icon: img("barcode.png")
  },
  {
    id: "lab_activities",
    name: "Lab activities",
    description: "Print Patient Visit Summary",
    url: "/",
    icon: img('lab.png')
  },
  {
    id: "demographics",
    name: "Demographics (Print)",
    description: "Print Patient Demographics",
    action: ({ patient }: any) => {
      const lbl = new PatientPrintoutService(patient.getID())
      return lbl.printDemographicsLbl()
    },
    icon: img("print.png")
  },
  {
    id: "demographics_edit",
    name: "Demographics (Edit)",
    description: "Edit Patient Demographics",
    url: "/",
    icon: img("print.png")
  },
  {
    id: "change_session_Date",
    name: "Change session date",
    description: "Change session date (for retrospective entry)",
    url: "/",
    icon: img("time.png")
  },
  {
    id: "programs",
    name: "Program(s)",
    description: "View / update patient's programs",
    url: "/",
    icon: img("programs.png")
  },
  {
    id: "f_number",
    name: "Filing Number (Print)",
    description: "Print Patient Filing Number",
    action({ patient }: any) {
      const lbl = new PatientPrintoutService(patient.getID())
      return lbl.printFilingNumberLbl()
    },
    icon: img("folder.png")
  },
  {
    id: "visit_summary",
    name: "Visit Summary (Print)",
    description: "Print Patient Visit Summary",
    action({ patient, visitDate }: any) {
      const lbl = new PatientPrintoutService(patient.getID())
      return lbl.printVisitSummaryLbl(visitDate)
    },
    icon: img("folder.png")
  },
  {
    id: "master_card",
    name: "Mastercard",
    description: "Mastercard",
    url: "/",
    icon: img("card.png")
  },
  {
    id: "enter_lab_result",
    name: "Enter Lab Result",
    description: "Enter Lab Test Result",
    url: "/",
    icon: img("enter.png")
  },
  {
    id: "archive_client",
    name: "Archive client",
    description: "Archive a client",
    url: "/",
    icon: img("archive.png")
  },
  {
    id: "assign_filing_number",
    name: "Assign filing number",
    description: "Assign a new filing number",
    url: "/",
    icon: img("archive.png")
  },
  {
    id: "change_patient_type",
    name: "Change patient type",
    description: "Change patient type",
    url: "/",
    icon: img("patient-type.png")
  }
]
export const PREFERENCES = {
        'Drug Management': [
          {
            name: "Enter Receipts",
            component: "@/components/ART/Settings.vue",
          },
          {
            name: "Enter Product relocation/Disposal",
            component: "@/components/ART/Settings.vue",
            route: "/",
          },
          {
            name: "Enter verified physical stock count",
            component: "@/components/ART/Settings.vue",
            route: "/",
          },
          {
            name: "Print Barcode",
            component: "@/components/ART/Settings.vue",
            route: "/",
          },
          {
            name: "Audit Trail",
            component: "@/components/ART/Settings.vue",
            route: "/",
          },
        ],
        'User Management': [
          {
            name: "Cohort / disaggregated",
            component: "@/components/ART/Settings.vue",
            route: "/",
          },
          {
            component: "@/components/ART/Settings.vue",
            name: "Survival analysis",
            route: "/",
          },
          {
            component: "@/components/ART/Settings.vue",
            name: "TPT new initiations",
            route: "/",
          },
        ],
        'System Preferences': [
          {
            name: "Ask pills remaining at home",
            value: "ask_pills_remaining_at_home"
          },
          {
            name: "Activate Filing Numbers",
            value: "use_filing_numbers"
          },
          {
            name: "Activate extended labs",
            value: "extended_labs"
          },
          {
            name: "Activate drug management",
            value: "activate_drug_management"
          },
          {
            name: "Activate Hypertension screening",
            value: "aactivate.htn.enhancement"
          },
          {
            name: "Activate fast track",
            value: "ask_pills_remaining_at_home"
          },
          {
            name: "Is this a military site",
            value: "military_site"
          },
          {
            name: "Activate 3HP auto select",
            value: "activate_3hp_auto_select"
          }
        ],
        'Data Management': [
          {
            name: "Cohort / disaggregated",
            component: "/ART/Settings.vue",
            route: "/",
          },
          {
            name: "Survival analysis",
            component: "/ART/Settings.vue",
            route: "/",
          },
          {
            name: "TPT new initiations",
            component: "/ART/Settings.vue",
            route: "/",
          },
        ],
      }
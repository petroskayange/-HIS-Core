import SingleSelect from "@/components/FormElements/HisSelect.vue";
import MultipleSelect from "@/components/FormElements/HisMultipleSelect.vue";
import TextInput from "@/components/FormElements/HisTextInput.vue"
import NumberInput from "@/components/FormElements/HisNumberInput.vue"
import MonthlyDays from "@/components/FormElements/HisMonthlyDays.vue"
import ArtRegimenSelection from "@/components/FormElements/HisArtRegimenSelection.vue"
import NextVisitInterval from "@/components/FormElements/HisNextVisitInterval.vue"
import TableViewer from "@/components/FormElements/HisTableViewer.vue"
import DosageInput from "@/components/FormElements/HisDosageInput.vue"
import YesNo from "@/components/FormElements/YesNoSelect.vue"
import MultiYesNo from "@/components/FormElements/MultiYesNoSelect.vue"
import WeightChart from "@/components/FormElements/HisWeightChart.vue"
import VitalsEntry from "@/components/FormElements/HisVitalsEntry.vue"
import AppointmentsEntry from "@/components/FormElements/HisAppointments.vue"

import SummaryPage from "@/components/FormElements/HisSummary.vue"
import ArtStagingSummary from "@/components/FormElements/ArtStagingSummary.vue"
import AdherenceInput from "@/components/FormElements/HisAdherenceInput.vue"
import LabOrders from "@/components/FormElements/HisLabOrders.vue"
import DispensationInput from "@/components/FormElements/DrugDispensationSelection.vue"
// Reference names for BaseFormComponents
export enum FieldType {
    TT_MONTHLY_DAYS="monthly-days",
    TT_TEXT="text-input",
    TT_NUMBER = "number-input",
    TT_DATETIME="datetime",
    TT_SELECT="single-select",
    TT_MULTIPLE_SELECT="multiple-select",
    TT_ART_REGIMEN_SELECTION="art-regimen-selection",
    TT_NEXT_VISIT_INTERVAL_SELECTION="next-visit-interval",
    TT_TABLE_VIEWER="table-viewer",
    TT_DOSAGE_INPUT="dosage-input",
    TT_YES_NO="yes-no",
    TT_MULTIPLE_YES_NO="multi-yes-no",
    TT_SUMMARY="summary-page",
    TT_WEIGHT_CHART = "weight-chart",
    TT_VITALS_ENTRY="vitals-entry",
    TT_ADHERENCE_INPUT = "adherence-input",
    TT_ART_STAGING_SUMMARY = "art-staging-summary",
    TT_LAB_ORDERS = "lab-orders",
    TT_APPOINTMENTS_ENTRY = "appointments-entry",
    TT_DISPENSATION_INPUT = 'dispensation-input'
}
// Components to be rendered
export const BaseFormComponents = {
    TextInput,
    SingleSelect,
    MultipleSelect,
    NumberInput,
    MonthlyDays,
    ArtRegimenSelection,
    NextVisitInterval,
    TableViewer,
    DosageInput,
    YesNo,
    SummaryPage,
    MultiYesNo,
    WeightChart,
    VitalsEntry,
    AdherenceInput,
    ArtStagingSummary,
    LabOrders,
    AppointmentsEntry,
    DispensationInput
}
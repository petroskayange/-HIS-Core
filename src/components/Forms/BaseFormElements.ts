import SingleSelect from "@/components/FormElements/HisSelect.vue";
import MultipleSelect from "@/components/FormElements/HisMultipleSelect.vue";
import TextInput from "@/components/FormElements/HisTextInput.vue"
import NumberInput from "@/components/FormElements/HisNumberInput.vue"
import MonthlyDays from "@/components/FormElements/HisMonthlyDays.vue"
import SummaryPage from "@/components/FormElements/HisSummary.vue"
// Reference names for BaseFormComponents
export enum FieldType {
    TT_MONTHLY_DAYS="monthly-days",
    TT_TEXT="text-input",
    TT_NUMBER = "number-input",
    TT_DATETIME="datetime",
    TT_SELECT="single-select",
    TT_MULTIPLE_SELECT="multiple-select",
    TT_SUMMARY="summary-page"
}
// Components to be rendered
export const BaseFormComponents = {
    TextInput,
    SingleSelect,
    MultipleSelect,
    NumberInput,
    MonthlyDays,
    SummaryPage
}
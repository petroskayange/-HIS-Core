<template>
  <his-standard-form
    :fields="fields"
    @onFinish="onFinish"
    :skipSummary="true"
    :cancelDestinationPath="cancelDestination"
  >
  </his-standard-form>
</template> 
<script lang="ts">
import { defineComponent } from "vue";
import { FieldType } from "@/components/Forms/BaseFormElements";
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import Validation from "@/components/Forms/validations/StandardValidations";
import EncounterMixinVue from "./EncounterMixin.vue";
import { PatientTypeService } from "@/apps/ART/services/patient_type_service";
import { toastSuccess, toastWarning } from "@/utils/Alerts";
import HisDate from "@/utils/Date";
import MonthOptions from "@/components/FormElements/Presets/MonthOptions";

export default defineComponent({
  mixins: [EncounterMixinVue],
  components: { HisStandardForm },
  data: () => ({
    fields: [] as any,
  }),
  watch: {
    $route: {
      async handler({ query }: any) {
        this.patientID = query.patient_id;
        this.fields = this.getFields();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async onFinish(formData: any) {
      //       const pts = new PatientTypeService(this.patientID);
      //       const encounter = await pts.createEncounter();
      //       if (encounter) {
      //         const observations = await pts.saveValueCodedObs(
      //           "Type of patient",
      //           formData.patient_type.value
      //         );
      //         if (!observations)
      //           return toastWarning("Unable to save patient observations");
      //         toastSuccess("Observations and encounter created!");
      //         this.nextTask();
      //       } else {
      //         return toastWarning("Unable to create treatment encounter");
      //       }
    },
    getYesNo() {
      return [
        {
          label: "yes",
          value: "Yes",
        },
        {
          label: "no",
          value: "No",
        },
      ];
    },
    getFPMethods() {
      const methods = [
        "ORAL CONTRACEPTIVE PILLS",
        "DEPO-PROVERA",
        "INTRAUTERINE CONTRACEPTION",
        "CONTRACEPTIVE IMPLANT",
        "MALE CONDOMS",
        "FEMALE CONDOMS",
        "TUBAL LIGATION",
        "NONE",
      ];
      return methods.map((method) => {
        return { label: method, value: method };
      });
    },
    getFields(): any {
      return [
        {
          id: "patient_type",
          helpText: `Current type`,
          type: FieldType.TT_MULTIPLE_YES_NO,
          options: () => [
            {
              label: "Pregnant",
              value: "",
              other: {
                values: this.getYesNo(),
              },
            },
            {
              label: "Breastfeeding",
              value: "",
              other: {
                values: this.getYesNo(),
              },
            },
          ],
        },
        {
          id: "patient_weight_chart",
          helpText: "Patient weight chart",
          type: FieldType.TT_WEIGHT_CHART,
          options: async () => {
            const history = await this.patient.getWeightHistory();
            const labels = history.map((i: any) =>
              HisDate.toStandardHisDisplayFormat(i.date)
            );
            const values = history.map((i: any) => i.weight);
            return [
              {
                label: "Weight for patient",
                value: "Weight trail",
                other: {
                  labels,
                  values,
                },
              },
            ];
          },
          config: {
            hiddenFooterBtns: ["Clear"],
          },
        },
        {
          id: "current_fp_methods",
          helpText: "What method are you currently on?",
          type: FieldType.TT_MULTIPLE_SELECT,
          options: () => this.getFPMethods(),
        },
        {
          id: "fp_methods",
          helpText: "What method are you providing today?",
          type: FieldType.TT_MULTIPLE_SELECT,
          options: () => this.getFPMethods(),
        },
        {
          id: "reason_for_no_fpm",
          helpText: "Main reason for not using family planning methods",
          type: FieldType.TT_SELECT,
          options: () => {
            return [
              { label: "Not Sexually active", value: "Not Sexually active" },
              {
                label: "Patient want to get pregnant",
                value: "Patient want to get pregnant",
              },
              {
                label: "Not needed for medical reasons",
                value: "Not needed for medical reasons",
              },
              {
                label: "At risk of unplanned pregnanct",
                value: "At risk of unplanned pregnanct",
              },
            ];
          },
        },
        {
          id: "specific_reason_for_no_fpm",
          helpText: "Specific reason for not using family planning methods",
          type: FieldType.TT_SELECT,
          options: () => {
            return [
              {
                label: "Following wishes of spouse",
                value: "Following wishes of spouse",
              },
              { label: "Religious reasons", value: "Religious reasons" },
              {
                label: "Afraid of side effects",
                value: "Afraid of side effects",
              },
              {
                label: "Never though about it",
                value: "Never though about it",
              },
              {
                label: "Indifferent (does not mind getting pregnant)",
                value: "Indifferent (does not mind getting pregnant)",
              },
            ];
          },
        },
        {
          id: "offer_contraceptive",
          helpText: "Offer contraceptives",
          type: FieldType.TT_SELECT,
          options: () => {
            return [
              { label: "Accepted", value: "Accepted" },
              { label: "Declined", value: "Declined" },
              { label: "Discuss with spouse", value: "Discuss with spouse" },
            ];
          },
        },
        {
          id: "offered_intervention",
          helpText: "Offered intervention",
          type: FieldType.TT_SELECT,
          options: () => this.getFPMethods(),
        },
        {
          id: "offer_cxca",
          helpText: "Refer client for CxCa screening",
          type: FieldType.TT_SELECT,
          options: () => this.getYesNo(),
        },
        {
          id: "reason_for_no_cxca",
          helpText: "Reason for denying CxCa screening",
          type: FieldType.TT_SELECT,
          options: () => {
            return [
              { label: "Not due for screening", value: "Not due for screening" },
              { label: "Client preferred counselling", value: "Client preferred counselling" },
              { label: "Not applicable", value: "Not applicable" },
            ];
          },
        },
        {
          id: "birth_year",
          helpText: "Year of birth",
          type: FieldType.TT_NUMBER,
          validation(val: any) {
            if (Validation.required(val)) return ["Year value is required"];

            const minYr = HisDate.getYearFromAge(100);
            const maxYr = HisDate.getCurrentYear();
            const notNum = Validation.isNumber(val);
            const notInRange = Validation.rangeOf(val, minYr, maxYr);

            if (val.label.match(/Unknown/i)) return;

            return notNum || notInRange;
          },
        },
        {
          id: "birth_month",
          helpText: "Month of Birth",
          type: FieldType.TT_SELECT,
          options: () => MonthOptions,
          condition: (form: any) => !form.birth_year.value.match(/Unknown/i),
          validation: (val: any, form: any) => {
            const month = val.value;
            const year = form.birth_year.value;
            const date = `${year}-${month}-01`;
            const notValid = HisDate.dateIsAfter(date)
              ? null
              : ["Month is greater than current month"];
            const noMonth = Validation.required(val);

            return noMonth || notValid;
          },
        },
        {
          id: "birth_day",
          helpText: "Birth day",
          type: FieldType.TT_MONTHLY_DAYS,
          condition: (form: any) =>
            form.birth_month != null &&
            !form.birth_month.label.match(/Unknown/i),
          validation: (val: any, form: any) => {
            const day = val.value;
            const year = form.birth_year.value;
            const month = form.birth_month.value;
            const date = `${year}-${month}-${day}`;
            const notValid = HisDate.dateIsAfter(date)
              ? null
              : ["Date is greater than current date"];
            const noDay = Validation.required(val);

            return noDay || notValid;
          },
        },
        {
          id: "on_tb_treatment",
          helpText: "On TB Treatment?",
          type: FieldType.TT_SELECT,
          options: () => this.getYesNo(),
        },
        {
          id: "tb_status",
          helpText: "TB Status",
          type: FieldType.TT_SELECT,
          options: () => {
            return [
              { label: "TB NOT suspected", value: "TB NOT suspected" },
              { label: "TB Suspected", value: "TB Suspected" },
              { label: "Confirmed TB Not on treatment", value: "Confirmed TB Not on treatment" },
            ];
          },
        },
        {
          id: "routine_tb_therapy",
          helpText: "TB preventive therapy (TPT) history",
          type: FieldType.TT_SELECT,
          options: () => {
            return [
              { label: "Currently on IPT", value: "Currently on IPT" },
              { label: "Currently on 3HP", value: "Currently on 3HP" },
              { label: "Complete course of 3HP in the past (3 months RFP+INH)", value: "Complete course of 3HP in the past (3 months RFP+INH)" },
              { label: "Complete course of IPT in the past (min. 6 months of INH)", value: "Complete course of IPT in the past (min. 6 months of INH)" },
              { label: "Aborted course of 3HP or IPT in the past", value: "Aborted course of 3HP or IPT in the past" },
              { label: "Never taken IPT or 3HP", value: "Never taken IPT or 3HP" },
            ];
          },
        },
         {
          id: "allergic_to_sulphur",
          helpText: "Allergic to Cotrimoxazole",
          type: FieldType.TT_SELECT,
          options: () => {
            return [
              ...this.getYesNo(),
              { label: "Unknown", value: "Unknown" },
            ];
          },
        },
        {
          id: "refer_to_clinician",
          helpText: "Refer to clinician",
          type: FieldType.TT_SELECT,
          options: () => this.getYesNo(),
        },
        {
          id: "prescription",
          helpText: "Medication to prescribe during this visit",
          type: FieldType.TT_MULTIPLE_SELECT,
          options: () => {
            return [
              { label: "ARVs", value: "Unknown" },
              { label: "CPT", value: "Unknown" },
              { label: "3HP (RFP + INH)", value: "3HP (RFP + INH)" },
              { label: "IPT", value: "IPT" },
              { label: "NONE OF THE ABOVE", value: "NONE OF THE ABOVE" },
            ];
          },
        },
      ];
    },
  },
});
</script>

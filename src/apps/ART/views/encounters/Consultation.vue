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
import { Field, Option } from "@/components/Forms/FieldInterface";
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import Validation from "@/components/Forms/validations/StandardValidations";
import EncounterMixinVue from "./EncounterMixin.vue";
import { toastSuccess, toastWarning } from "@/utils/Alerts";
import HisDate from "@/utils/Date";
import { findIndex } from "lodash";
import MonthOptions from "@/components/FormElements/Presets/MonthOptions";
import { ConsultationService } from "@/apps/ART/services/consultation_service";
import { Patientservice } from "@/services/patient_service";

export default defineComponent({
  mixins: [EncounterMixinVue],
  components: { HisStandardForm },
  data: () => ({
    fields: [] as any,
    consultation: {} as any,
    hasTBTherapyObs: false
  }),
  watch: {
    ready: {
      async handler(value: boolean) {
        if(value) {
          this.fields = this.getFields();
          this.consultation = new ConsultationService(this.patientID);
          this.completedTBTherapy()
        }
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
    isGender(gender: string) {
      return this.patient.getGender() === gender;
    },
    async completedTBTherapy() {
    const data = await ConsultationService.getAll(this.patientID, "TB treatment history");
    if(!data) return 
    const obs = await data.filter((data: any) => {
        return data.value_text.match(/Complete/i); 
    });
      this.hasTBTherapyObs = obs.length > 0; 
      
    },
    isOfChildBearingAge() {
      const age = this.patient.getAge();
      return age >= 9 && age <= 55;
    },
    ontubalLigation() {
      return true;
    },
    showPregnancyQuestions() {
      return (
        this.isGender("F") &&
        this.isOfChildBearingAge() &&
        this.ontubalLigation()
      );
    },
    showCurrentContraceptionMethods(formData: any) {
      return this.showPregnancyQuestions() && !this.isPregnant(formData);
    },
    showNewContraceptionMethods(formData: any) {
      return (
        this.showPregnancyQuestions() &&
        !this.isPregnant(formData) &&
        !this.isOnTubalLigation(formData)
      );
    },
    isPregnant(formData: any) {
      return (
        formData.pregnant_breastfeeding.filter(
          (data: any) => data.value === "Yes"
        ).length > 0
      );
    },
    isOnTubalLigation(formData: any) {
      return (
        formData.current_fp_methods.filter(
          (data: any) => data.value === "TUBAL LIGATION"
        ).length > 0
      );
    },
    offerCxCa() {
      //if is a female and cervical cancer is enabled
      return this.isGender("F");
    },
    disableFPMethods(listData: Array<Option>, value: Option) {
      if (value.isChecked && value.label === "NONE") {
        return listData.map((i) => {
          console.log("Here")
          if (i.label != "NONE") i.isChecked = false;
          return i;
        });
      } else if (value.label != "NONE" && value.isChecked) {
        const noneIndex = findIndex(listData, { label: "NONE" });
        listData[noneIndex].isChecked = false;
      }
      return listData;
    },
    declinedFPM(formData: any) {
      if(!formData.fp_methods) return false
      return (
        formData.fp_methods.filter(
          (data: any) => data.value === "NONE"
        ).length > 0
      );
    },
    riskOfUnplannedPregnancy(formData: any) {
      if(!formData.reason_for_no_fpm) return false
      return formData.reason_for_no_fpm.value === "At risk of unplanned pregnancy"
    },
    acceptedIntervention(formData: any) {
      if(!formData.offer_contraceptives) return false
      return formData.offer_contraceptives.value === "Accepted"
    },
    notOnTBTreatment(formData: any) {
      if(!formData.on_tb_treatment) return false
      return formData.on_tb_treatment.value === "No"
    },
    declinedCxCa(formData: any) {
      if(!formData.offer_cxca) return false
      return formData.offer_cxca.value === "No"
    },
    showOtherSideEffects(formData: any) {
      return formData.side_effects.filter((data: any) => {
        return data.label === "Other" && data.value === "Yes"
      }).length > 0
    },
    hasTBSymptoms(formData: any) {
      return formData.tb_side_effects.filter((data: any) => {
        return data.value === "Yes"
      }).length > 0
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
    async getOptions(options: string[]) {
      return options.map((data: any) => {
        return {
          label: data,
          value: "",
          other: {
            values: this.getYesNo(),
          },
        };
      });
    },
    getContraindications() {
      const contraIndications = [
        "Peripheral neuropathy",
        "Jaundice",
        "Lipodystrophy",
        "Kidney Failure",
        "Psychosis",
        "Gynaecomastia",
        "Anemia",
        "Skin rash",
        "Insomnia",
        "Other",
      ];
      return this.getOptions(contraIndications);
    },
    getOtherContraindications() {
      const contraIndications = [
        "Fever",
        "Vomiting",
        "Dizziness",
        "Headache",
        "Night Sweats",
        "Nausea",
        "Weight loss / Failure to thrive / malnutrition",
        "Lactic acidosis",
        "Cough",
        "Heavy alcohol use",
        "Other (Specify)",
      ];
      return this.getOptions(contraIndications);
    },
    getTBSymptoms() {
      const contraIndications = [
        "Cough of any duration",
        "Fever",
        "Night Sweats",
        "Weight loss / Failure to thrive / malnutrition",
      ];
      return this.getOptions(contraIndications);
    },
    getFields(): any {
      return [
        {
          id: "guardian_only_prescription",
          helpText: "Medication to prescribe during this visit",
          type: FieldType.TT_MULTIPLE_SELECT,
          onValueUpdate: (listData: Array<Option>, value: Option) => {
            if (value.isChecked && value.label === "NONE OF THE ABOVE") {
              return listData.map((i) => {
                if (i.label != "NONE OF THE ABOVE") i.isChecked = false;
                return i;
              });
            } else if (value.label != "NONE OF THE ABOVE" && value.isChecked) {
              const noneIndex = findIndex(listData, {
                label: "NONE OF THE ABOVE",
              });
              listData[noneIndex].isChecked = false;
            }
            return listData;
          },
          condition: () => false, // show if guardian only visit
          options: () => {
            return [
              { label: "ARVs", value: "ARVs" },
              { label: "CPT", value: "CPT" },
              { label: "IPT", value: "IPT" },
              { label: "NONE OF THE ABOVE", value: "NONE OF THE ABOVE" },
            ];
          },
        },
        {
          id: "pregnant_breastfeeding",
          helpText: `Patient Pregnant or breastfeeding?`,
          condition: () => this.showPregnancyQuestions(),
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
          onValueUpdate: (listData: Array<Option>, value: Option) => {
            return this.disableFPMethods(listData, value);
          },
          condition: (formData: any) =>
            this.showCurrentContraceptionMethods(formData),
          type: FieldType.TT_MULTIPLE_SELECT,
          options: () => this.getFPMethods(),
        },
        {
          id: "fp_methods",
          condition: (formData: any) =>
            this.showNewContraceptionMethods(formData),
          helpText: "What method are you providing today?",
          onValueUpdate: (listData: Array<Option>, value: Option) => {
            return this.disableFPMethods(listData, value);
          },
          type: FieldType.TT_MULTIPLE_SELECT,
          options: () => this.getFPMethods(),
        },
        {
          id: "reason_for_no_fpm",
          helpText: "Main reason for not using family planning methods",
          condition: (formData: any) => this.declinedFPM(formData),
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
                label: "At risk of unplanned pregnancy",
                value: "At risk of unplanned pregnancy",
              },
            ];
          },
        },
        {
          id: "specific_reason_for_no_fpm",
          helpText: "Specific reason for not using family planning methods",
          condition: (formData: any) => this.riskOfUnplannedPregnancy(formData),
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
          //show when previous one has a value
          condition: (formData: any) => this.riskOfUnplannedPregnancy(formData),
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
          //show when the previous one is accepted
          condition: (formData: any) => this.acceptedIntervention(formData),
          type: FieldType.TT_SELECT,
          options: () => this.getFPMethods(),
        },
        {
          id: "offer_cxca",
          helpText: "Refer client for CxCa screening",
          condition: () => this.offerCxCa(),
          type: FieldType.TT_SELECT,
          options: () => this.getYesNo(),
        },
        {
          id: "reason_for_no_cxca",
          helpText: "Reason for denying CxCa screening",
          condition: (formData: any) => this.declinedCxCa(formData),
          type: FieldType.TT_SELECT,
          options: () => {
            return [
              {
                label: "Not due for screening",
                value: "Not due for screening",
              },
              {
                label: "Client preferred counselling",
                value: "Client preferred counselling",
              },
              { label: "Not applicable", value: "Not applicable" },
            ];
          },
        },
        {
          id: "birth_year",
          helpText: "Previous CxCa test year",
          condition: (formData: any) => this.declinedCxCa(formData),
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
          id: "cxca_estimate",
          helpText: "Estimated time since last CxCa screening",
          type: FieldType.TT_SELECT,
          condition: (form: any) => form.birth_year && form.birth_year.value.match(/Unknown/i),
          options: () => {
            return [
              { label: "6 months", value: "6 months" },
              { label: "12 months", value: "12 months" },
              { label: "18 months", value: "18 months" },
              { label: "24 months", value: "24 months" },
              { label: "Over 2 years", value: "Over 2 years" },
            ];
          },
        },
        {
          id: "birth_month",
          helpText: "Month of Birth",
          type: FieldType.TT_SELECT,
          options: () => MonthOptions,
          condition: (form: any) => form.birth_year && !form.birth_year.value.match(/Unknown/i),
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
          id: "side_effects",
          helpText:
            "Contraindications / Side effects (select either 'Yes' or 'No')",
          type: FieldType.TT_MULTIPLE_YES_NO,
          options: () => this.getContraindications(),
        },
        {
          id: "other side_effects",
          condition: (formData: any) => this.showOtherSideEffects(formData),
          helpText:
            "Other Contraindications / Side effects (select either 'Yes' or 'No')",
          type: FieldType.TT_MULTIPLE_YES_NO,
          options: () => this.getOtherContraindications(),
        },
        {
          id: "on_tb_treatment",
          helpText: "On TB Treatment?",
          type: FieldType.TT_SELECT,
          options: () => this.getYesNo(),
        },
        {
          id: "tb_side_effects",
          helpText: "TB Associated symptoms",
          condition: (formData: any) => this.notOnTBTreatment(formData),
          type: FieldType.TT_MULTIPLE_YES_NO,
          options: () => this.getTBSymptoms(),
        },
        {
          id: "tb_status",
          helpText: "TB Status",
          type: FieldType.TT_SELECT,
          condition: (formData: any) => this.hasTBSymptoms(formData),
          options: () => {
            return [
              { label: "TB NOT suspected", value: "TB NOT suspected" },
              { label: "TB Suspected", value: "TB Suspected" },
              {
                label: "Confirmed TB Not on treatment",
                value: "Confirmed TB Not on treatment",
              },
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
              {
                label: "Complete course of 3HP in the past (3 months RFP+INH)",
                value: "Complete course of 3HP in the past (3 months RFP+INH)",
              },
              {
                label:
                  "Complete course of IPT in the past (min. 6 months of INH)",
                value:
                  "Complete course of IPT in the past (min. 6 months of INH)",
              },
              {
                label: "Aborted course of 3HP or IPT in the past",
                value: "Aborted course of 3HP or IPT in the past",
              },
              {
                label: "Never taken IPT or 3HP",
                value: "Never taken IPT or 3HP",
              },
            ];
          },
        },
        {
          id: "allergic_to_sulphur",
          helpText: "Allergic to Cotrimoxazole",
          type: FieldType.TT_SELECT,
          options: () => {
            return [...this.getYesNo(), { label: "Unknown", value: "Unknown" }];
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
              { label: "ARVs", value: "ARVs" },
              { label: "CPT", value: "CPT" },
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

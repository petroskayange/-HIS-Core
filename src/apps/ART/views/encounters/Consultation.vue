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
import { Option } from "@/components/Forms/FieldInterface";
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import Validation from "@/components/Forms/validations/StandardValidations";
import EncounterMixinVue from "./EncounterMixin.vue";
import { toastSuccess, toastWarning } from "@/utils/Alerts";
import HisDate from "@/utils/Date";
import { findIndex } from "lodash";
import { ConsultationService } from "@/apps/ART/services/consultation_service";
import { UserService } from "@/services/user_service";

export default defineComponent({
  mixins: [EncounterMixinVue],
  components: { HisStandardForm },
  data: () => ({
    fields: [] as any,
    consultation: {} as any,
    hasTBTherapyObs: false,
    allergicToSulphur: false
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
    disablePrescriptions(listData: Array<Option>, value: Option) {
      if (value.isChecked && value.label === "NONE OF THE ABOVE") {
        return listData.map((i) => {
          if (i.label != "NONE OF THE ABOVE") i.isChecked = false;
          return i;
        });
      } else if (value.label != "NONE OF THE ABOVE" && value.isChecked) {
        const noneIndex = findIndex(listData, { label: "NONE OF THE ABOVE" });
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
    updateAllergicToSulphur(formData: any) {
      if(formData.value === "Yes") {
        this.allergicToSulphur = true;
      }else if(formData.value === "No" || formData.value === "Unknown"){
        this.allergicToSulphur = false;
      }
    },
    updateCompletedTPT(formData: any) {
      if(formData.value.match(/Complete/ig)) {
        this.hasTBTherapyObs = true;
      }else {
        this.hasTBTherapyObs = false;
      }
    },
    showOtherSideEffects(formData: any) {
      return formData.side_effects.filter((data: any) => {
        return data.label === "Other" && data.value === "Yes"
      }).length > 0
    },
    hasTBSymptoms(formData: any) {
      if(!formData.tb_side_effects) return false
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
    getPrescriptionFields() {
      const vals =[
              { label: "ARVs", value: "ARVs", isChecked: true},
              { label: "CPT", value: "CPT", isChecked: true},
              { label: "3HP (RFP + INH)", value: "3HP (RFP + INH)", isChecked: true},
              { label: "IPT", value: "IPT" },
              { label: "NONE OF THE ABOVE", value: "NONE OF THE ABOVE" },
            ];
      const exclusions = [];
      if(this.allergicToSulphur) {
        exclusions.push({value: "CPT", description: "Allergic to CPT"});
      }
      if(this.hasTBTherapyObs) {
        exclusions.push({value: "IPT", description: "Completed TPT"}, {value: "3HP (RFP + INH)", description: "Completed TPT"});
      }
      return [...this.removeAndDisable(vals, exclusions)]
      // if(this.isAllergic)
    },
    removeAndDisable(initialFields: any[], exclusionList: any[]) {
      return initialFields.map(data => {
        const isAvailable = exclusionList.filter(val => val.value === data.value);
        const checked = isAvailable.length > 0 ? false : data.isChecked;
        const disabled = isAvailable.length > 0 ? true : false;
        const vals =  { label: data.label, value: data.value, isChecked: checked, disabled: disabled };
        if(disabled) {
          Object.assign(vals, {description: {show: 'always', text: isAvailable[0].description, color: 'danger'}})
        }
        return vals;
      });
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
          condition: (formData: any) => this.hasTBSymptoms(formData),
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
          unload: async (data: any) => this.updateCompletedTPT(data),
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
          unload: async (data: any) => this.updateAllergicToSulphur(data),
          options: () => {
            return [...this.getYesNo(), { label: "Unknown", value: "Unknown" }];
          },
        },
        {
          id: "refer_to_clinician",
          helpText: "Refer to clinician",
          condition: () => UserService.isNurse(),
          type: FieldType.TT_SELECT,
          options: () => this.getYesNo(),
        },
        {
          id: "prescription",
          helpText: "Medication to prescribe during this visit",
          type: FieldType.TT_MULTIPLE_SELECT,
          onValueUpdate: (listData: Array<Option>, value: Option) => {
            return this.disablePrescriptions(listData, value);
          },
          options: () => this.getPrescriptionFields(), 
        },
      ];
    },
  },
});
</script>

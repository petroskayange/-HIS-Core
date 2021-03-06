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
import { alertAction, toastSuccess, toastWarning } from "@/utils/Alerts";
import HisDate from "@/utils/Date";
import { findIndex, isEmpty } from "lodash";
import { ConsultationService } from "@/apps/ART/services/consultation_service";
import { UserService } from "@/services/user_service";
import { OrderService } from "@/services/order_service";
import HisApp from "@/apps/app_lib";
import { ConceptService } from "@/services/concept_service";

export default defineComponent({
  mixins: [EncounterMixinVue],
  components: { HisStandardForm },
  data: () => ({
    fields: [] as any,
    consultation: {} as any,
    hasTBTherapyObs: false,
    allergicToSulphur: false,
    TBSuspected: false,
    presentedTBSymptoms: false,
    pregnancy: [] as any,
    currentFPM: [] as any,
    newFPM: [] as any,
    reasonForNoFPM: {} as any,
    specificReasonForNoFPM: {} as any,
    offerContraceptives: {} as any,
    sideEffects: [] as any,
    otherSideEffects: [] as any,
    tbObs: {} as any,
    tbSideEffectsObs: [] as any,
    tbStatusObs: {} as any,
    treatmentStatusObs: {} as any,
    sulphurObs: {} as any,
    referObs: {} as any,
    medicationObs: [] as any,
  }),
  watch: {
    ready: {
      async handler(value: boolean) {
        if (value) {
          this.fields = this.getFields();
          this.consultation = new ConsultationService(this.patientID);
          this.completedTBTherapy();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async onFinish(formData: any) {
      this.setDrugOrderObs(formData.prescription);
      const encounter = await this.consultation.createEncounter();

      if (!encounter) return toastWarning("Unable to create encounter");

      const data = await Promise.all([
        ...this.pregnancy,
        ...this.currentFPM,
        ...this.newFPM,
        this.reasonForNoFPM,
        this.specificReasonForNoFPM,
        this.offerContraceptives,
        ...this.sideEffects,
        ...this.otherSideEffects,
        this.tbObs,
        ...this.tbSideEffectsObs,
        this.tbStatusObs,
        this.treatmentStatusObs,
        this.sulphurObs,
        this.referObs,
        ...this.medicationObs,
      ]);
      const filtered = data.filter((d) => !isEmpty(d));
      const obs = await this.consultation.saveObservationList(filtered);

      if (!obs) return toastWarning("Unable to save patient observations");

      toastSuccess("Observations and encounter created!");

      this.nextTask();
    },
    isGender(gender: string) {
      return this.patient.getGender() === gender;
    },
    async completedTBTherapy() {
      const obs = await this.patient.getCompleteTBTherapyHistory(); 
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
          if (i.label != "NONE") {
            i.isChecked = false;
            i.disabled = false;
          }
          return i;
        });
      } else if (value.label != "NONE" && value.isChecked) {
        if (value.label.match(/condom/gi)) {
          alertAction("Combine with other modern methods of family planning", [
            {
              text: "OK",
              handler: () => null,
            },
          ]);
        }
        const noneIndex = findIndex(listData, { label: "NONE" });
        listData[noneIndex].isChecked = false;
        const vals = this.consultation.familyPlanningMethods(
          value.label,
          listData
        );
        const currentIndex = findIndex(vals, { label: value.label });
        vals[currentIndex].isChecked = true;
        return vals;
      } else {
        return listData.map((i) => {
          i.disabled = false;
          return i;
        });
      }
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
    setDrugOrderObs(listData: Array<Option>) {
      listData.forEach((element) => {
        if (element.label != "NONE OF THE ABOVE" && element.isChecked) {
          this.medicationObs.push(
            this.consultation.buildValueCoded(
              "Medication orders",
              element.label
            )
          );
        }
        if (element.label === "NONE OF THE ABOVE" && element.isChecked) {
          this.medicationObs.push(
            this.consultation.buildValueCoded("Prescribe drugs", "No")
          );
        }
      });
    },
    declinedFPM(formData: any) {
      if (!formData.fp_methods) return false;
      return (
        formData.fp_methods.filter((data: any) => data.value === "NONE")
          .length > 0
      );
    },
    riskOfUnplannedPregnancy(formData: any) {
      if (!formData.reason_for_no_fpm) return false;
      return (
        formData.reason_for_no_fpm.value === "At risk of unplanned pregnancy"
      );
    },
    acceptedIntervention(formData: any) {
      if (!formData.offer_contraceptives) return false;
      return formData.offer_contraceptives.value === "Accepted";
    },
    notOnTBTreatment(formData: any) {
      if (!formData.on_tb_treatment) return false;
      return formData.on_tb_treatment.value === "No";
    },
    declinedCxCa(formData: any) {
      if (!formData.offer_cxca) return false;
      return formData.offer_cxca.value === "No";
    },
    updateAllergicToSulphur(formData: any) {
      if (formData.value === "Yes") {
        this.allergicToSulphur = true;
      } else if (formData.value === "No" || formData.value === "Unknown") {
        this.allergicToSulphur = false;
      }
    },
    updateCompletedTPT(formData: any) {
      if (formData.value.match(/Complete/gi)) {
        this.hasTBTherapyObs = true;
      } else {
        this.hasTBTherapyObs = false;
      }
    },
    showOtherSideEffects(formData: any) {
      return (
        formData.side_effects.filter((data: any) => {
          return data.label === "Other" && data.value === "Yes";
        }).length > 0
      );
    },
    hasTBSymptoms(formData: any) {
      if (!formData.tb_side_effects) return false;
      const val =
        formData.tb_side_effects.filter((data: any) => {
          return data.value === "Yes";
        }).length > 0;
      this.presentedTBSymptoms = val;
      return val;
    },
    getFieldPreset() {
      if (this.presentedTBSymptoms) {
        return { label: "TB Suspected", value: "TB Suspected" };
      }
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
    getFPMethods(exclusionList: string[] = []) {
      const methods = this.consultation.getFamilyPlanningMethods(); 
      const filtered = methods.filter((data: string) => !exclusionList.includes(data));
      return filtered.map((method: any) => {
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
      const contraIndications = ConceptService.getConceptsByCategory('contraindication').map(data => data.name);
      return this.getOptions([...contraIndications, 'Other']);
    },
    getOtherContraindications() {
      const contraIndications = ConceptService.getConceptsByCategory('side_effect').map(data => data.name);
      return this.getOptions([...contraIndications, 'Other (Specify)']);
    },
    getTBSymptoms() {

      const contraIndications = ConceptService.getConceptsByCategory('tb_symptom').map(data => data.name);
      return this.getOptions([...contraIndications]);
    },
    getPrescriptionFields() {
      const vals = [
        { label: "ARVs", value: "ARVs", isChecked: true },
        { label: "CPT", value: "CPT", isChecked: true },
        { label: "3HP (RFP + INH)", value: "3HP (RFP + INH)", isChecked: true },
        { label: "IPT", value: "IPT" },
        { label: "NONE OF THE ABOVE", value: "NONE OF THE ABOVE" },
      ];
      const exclusions = [];
      if (this.allergicToSulphur) {
        exclusions.push({ value: "CPT", description: "Allergic to CPT" });
      }
      if (this.TBSuspected) {
        exclusions.push(
          { value: "IPT", description: "TB Suspect" },
          { value: "3HP (RFP + INH)", description: "TB Suspect" }
        );
      }
      if (this.hasTBTherapyObs) {
        exclusions.push(
          { value: "IPT", description: "Completed TPT" },
          { value: "3HP (RFP + INH)", description: "Completed TPT" }
        );
      }
      return [...this.removeAndDisable(vals, exclusions)];
      // if(this.isAllergic)
    },
    removeAndDisable(initialFields: any[], exclusionList: any[]) {
      return initialFields.map((data) => {
        const isAvailable = exclusionList.filter(
          (val) => val.value === data.value
        );
        const checked = isAvailable.length > 0 ? false : data.isChecked;
        const disabled = isAvailable.length > 0 ? true : false;
        const vals = {
          label: data.label,
          value: data.value,
          isChecked: checked,
          disabled: disabled,
        };
        if (disabled) {
          Object.assign(vals, {
            description: {
              show: "always",
              text: isAvailable[0].description,
              color: "danger",
            },
          });
        }
        return vals;
      });
    },
    getFields(): any {
      return [
        {
          id: "prescription",
          helpText: "Medication to prescribe during this visit",
          type: FieldType.TT_MULTIPLE_SELECT,
          validation: (data: any) => Validation.required(data),
          onValueUpdate: (listData: Array<Option>, value: Option) => {
            return this.disablePrescriptions(listData, value);
          },
          options: () => this.getPrescriptionFields(),
          condition: () => false, // show if guardian only visit
        },
        {
          id: "patient_lab_orders",
          helpText: "Lab orders",
          type: FieldType.TT_LAB_ORDERS,
          options: async () => {
            const orders = await OrderService.getOrders(this.patientID);
            const VLOrders = OrderService.formatLabs(orders);
            return [
              {
                label: "Lab orders",
                value: "order trail",
                other: {
                  values: VLOrders,
                },
              },
            ];
          },
          config: {
            hiddenFooterBtns: ["Clear"],
            footerBtns: [
              {
                name: "Order",
                size: "large",
                slot: "end",
                color: "primary",
                visible: true,
                onClick: async () => {
                  const data = await HisApp.makeLabOrders();
                  // this.fieldComponent = 'custom_regimen'
                },
                visibleOnStateChange: (state: Record<string, any>) => {
                  return state.index === 1;
                },
              },
            ],
          },
        },
        {
          id: "pregnant_breastfeeding",
          helpText: `Patient Pregnant or breastfeeding?`,
          condition: () => this.showPregnancyQuestions(),
          type: FieldType.TT_MULTIPLE_YES_NO,
          validation: (data: any) => Validation.anyEmpty(data),
          unload: (data: any) => {
            this.pregnancy = data.map((data: Option) => {
              return this.consultation.buildValueCoded(
                data.other.concept,
                data.value
              );
            });
          },
          options: () => [
            {
              label: "Pregnant",
              value: "",
              other: {
                values: this.getYesNo(),
                concept: "Is patient pregnant",
              },
            },
            {
              label: "Breastfeeding",
              value: "",
              other: {
                values: this.getYesNo(),
                concept: "Is patient breast feeding",
              },
            },
          ],
        },
        {
          id: "patient_weight_chart",
          helpText: "Patient weight chart",
          type: FieldType.TT_WEIGHT_CHART,
          options: async () => {
            const bmi = await this.patient.getBMI()
            const values = await this.patient.getWeightHistory()
            return [
              {
                label: "Weight for patient",
                value: "Weight trail",
                other: {
                  bmi,
                  values: values.map((d: any) => ({ 
                    x: HisDate.toStandardHisDisplayFormat(d.date), 
                    y: d.weight
                  })),
                  age: this.patient.getAge()
                }
              }
            ]
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
          unload: (data: any) => {
            this.currentFPM = data.map((data: Option) => {
              return this.consultation.buildValueCoded(data.label, data.value);
            });
          },
          validation: (data: any) => Validation.required(data),
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
          validation: (data: any) => Validation.required(data),
          onValueUpdate: (listData: Array<Option>, value: Option) => {
            return this.disableFPMethods(listData, value);
          },
          unload: (data: any) => {
            this.newFPM = data.map((data: Option) => {
              return this.consultation.buildValueCoded(data.label, data.value);
            });
          },
          type: FieldType.TT_MULTIPLE_SELECT,
          options: () => this.getFPMethods(),
        },
        {
          id: "reason_for_no_fpm",
          helpText: "Main reason for not using family planning methods",
          validation: (data: any) => Validation.required(data),
          condition: (formData: any) => this.declinedFPM(formData),
          unload: (data: any) => {
            this.reasonForNoFPM = this.consultation.buildValueText(
              "Why does the woman not want to use birth control",
              data.value
            );
          },
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
          validation: (data: any) => Validation.required(data),
          condition: (formData: any) => this.riskOfUnplannedPregnancy(formData),
          unload: (data: any) => {
            this.specificReasonForNoFPM = this.consultation.buildValueText(
              "Reason for not using contraceptives",
              data.value
            );
          },
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
          id: "offer_contraceptives",
          helpText: "Offer contraceptives",
          //show when previous one has a value
          validation: (data: any) => Validation.required(data),
          condition: (formData: any) => this.riskOfUnplannedPregnancy(formData),
          unload: (data: any) => {
            this.offerContraceptives = this.consultation.buildValueCoded(
              "Family planning, action to take",
              data.value
            );
          },
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
          validation: (data: any) => Validation.required(data),
          condition: (formData: any) => this.acceptedIntervention(formData),
          type: FieldType.TT_MULTIPLE_SELECT,
          unload: (data: any) => {
            this.newFPM = data.map((data: Option) => {
              return this.consultation.buildValueCoded(data.label, data.value);
            });
          },
          options: () => this.getFPMethods(["NONE"]),
        },
        {
          id: "side_effects",
          helpText:
            "Contraindications / Side effects (select either 'Yes' or 'No')",
          type: FieldType.TT_MULTIPLE_YES_NO,
          validation: (data: any) => Validation.anyEmpty(data),
          unload: async (data: any) => {
            this.sideEffects = await data.map(async (data: Option) => {
              const host = await this.consultation.buildValueCoded(
                "Malawi ART side effects",
                data.label
              );
              const child = await this.consultation.buildValueCoded(
                data.label,
                data.value
              );
              return {
                ...host,
                child: {
                  ...child,
                },
              };
            });
          },
          options: () => this.getContraindications(),
        },
        {
          id: "other_side_effects",
          condition: (formData: any) => this.showOtherSideEffects(formData),
          validation: (data: any) => Validation.anyEmpty(data),
          helpText:
            "Other Contraindications / Side effects (select either 'Yes' or 'No')",
          type: FieldType.TT_MULTIPLE_YES_NO,
          unload: async (data: any) => {
            const filtered = data.filter((d: any) => {
              return d.label !== "Other (Specify)";
            });
            this.otherSideEffects = await filtered.map(async (data: Option) => {
              const host = await this.consultation.buildValueCoded(
                "Other side effect",
                data.label
              );
              const child = await this.consultation.buildValueCoded(
                data.label,
                data.value
              );
              return {
                ...host,
                child: {
                  ...child,
                },
              };
            });
          },
          options: () => this.getOtherContraindications(),
        },
        {
          id: "on_tb_treatment",
          helpText: "On TB Treatment?",
          validation: (data: any) => Validation.required(data),
          type: FieldType.TT_SELECT,
          unload: async (data: any) => {
            if (data.value === "Yes") {
              this.TBSuspected = true;
            } else {
              this.TBSuspected = false;
            }
            this.tbObs = this.consultation.buildValueCoded(
              data.label,
              data.value
            );
          },
          options: () => this.getYesNo(),
        },
        {
          id: "tb_side_effects",
          helpText: "TB Associated symptoms",
          validation: (data: any) => Validation.anyEmpty(data),
          condition: (formData: any) => this.notOnTBTreatment(formData),
          unload: async (vals: any) => {
            const val =
              vals.filter((data: any) => {
                return data.value === "Yes";
              }).length > 0;
            this.presentedTBSymptoms = val;
            this.tbSideEffectsObs = await vals.map(async (data: Option) => {
              const host = await this.consultation.buildValueCoded(
                "Routine TB Screening",
                data.label
              );
              const child = await this.consultation.buildValueCoded(
                data.label,
                data.value
              );
              return {
                ...host,
                child: {
                  ...child,
                },
              };
            });
          },
          type: FieldType.TT_MULTIPLE_YES_NO,
          options: () => this.getTBSymptoms(),
        },
        {
          id: "tb_status",
          helpText: "TB Status",
          type: FieldType.TT_SELECT,
          // pre select yb suspected when the patient has TB symptoms
          preset: this.getFieldPreset(),
          validation: (data: any) => Validation.required(data),
          condition: (formData: any) => this.hasTBSymptoms(formData),
          unload: async (data: any) => {
            if (data.value === "TB Suspected") {
              this.TBSuspected = true;
            } else {
              this.TBSuspected = false;
            }
            this.tbStatusObs = this.consultation.buildValueText(
              "TB Status",
              data.value
            );
          },
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
          validation: (data: any) => Validation.required(data),
          condition: () => !this.hasTBTherapyObs,
          unload: async (data: any) => {
            this.updateCompletedTPT(data);
            this.treatmentStatusObs = this.consultation.buildValueText(
              "TB Status",
              data.value
            );
          },
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
          validation: (data: any) => Validation.required(data),
          unload: async (data: any) => {
            this.updateAllergicToSulphur(data);
            this.sulphurObs = this.consultation.buildValueCoded(
              "Allergic to sulphur",
              data.value
            );
          },
          options: () => {
            return [...this.getYesNo(), { label: "Unknown", value: "Unknown" }];
          },
        },
        {
          id: "refer_to_clinician",
          helpText: "Refer to clinician",
          condition: () => UserService.isNurse(),
          validation: (data: any) => Validation.required(data),
          unload: async (data: any) => {
            this.referObs = this.consultation.buildValueCoded(
              "Refer to clinician",
              data.value
            );
          },
          type: FieldType.TT_SELECT,
          options: () => this.getYesNo(),
        },
        {
          id: "prescription",
          helpText: "Medication to prescribe during this visit",
          type: FieldType.TT_MULTIPLE_SELECT,
          validation: (data: any) => Validation.required(data),
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

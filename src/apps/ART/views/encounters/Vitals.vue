<template>
  <his-standard-form
    :fields="fields"
    :activeField="activeField"
    @onskip="activeField = ''"
    @onFinish="onFinish"
    :skipSummary="true"
    :cancelDestinationPath="cancelDestination"
  >
  </his-standard-form>
</template> 
<script lang="ts">
import { defineComponent } from "vue";
import { Field, Option } from "@/components/Forms/FieldInterface";
import { FieldType } from "@/components/Forms/BaseFormElements";
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import { Patient } from "@/interfaces/patient";
import { Patientservice } from "@/services/patient_service";
import Validation from "@/components/Forms/validations/StandardValidations";
import { GlobalPropertyService } from "@/services/global_property_service";
import { ObservationService } from "@/services/observation_service";
import { VitalsService } from "@/apps/ART/services/vitals_service";
import { toastSuccess, toastWarning } from "@/utils/Alerts";
import EncounterMixinVue from './EncounterMixin.vue'
export default defineComponent({
  mixins: [EncounterMixinVue],
  components: { HisStandardForm },
  data: () => ({
    activeField: "",
    fields: [] as Array<Field>,
    patientID: "" as any,
    age: null as any,
    gender: null as any,
    hasBPinfo: false,
    recentHeight: null,
    HTNEnabled: false,
    hasHTNObs: false,
    vitals: {} as any,
  }),
  computed: {
    patientDashboard(): string {
      return `/patient/dashboard/${this.patientID}`;
    },
  },
  watch: {
    $route: {
      async handler({ query }: any) {
        this.init(query.patient_id);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async onFinish(formData: any) {
      const encounter = await this.vitals.createEncounter();

      if (encounter) {
       const obs = await  this.buildObs(formData);
        const observations = await this.vitals.saveObservationList(obs);
        if (!observations) return toastWarning('Unable to save patient observations')

        toastSuccess('Observations and encounter created!');
            this.nextTask()
      } else {
        return toastWarning("Unable to create treatment encounter");
      }
    },
    async buildObs(formData: any) {
      const observations: any = await this.mapObs(
        this.sanitizeVitals(formData.vitals).filter(
          (element) => element.label !== "BP"
        )
      );
      if (this.HTNEnabled && !this.hasHTNObs) {
        const obs = await ObservationService.buildValueText(
          "Treatment status",
          formData.on_htn_medication.value
        );
        observations.push(obs);
      }
      return observations;
    },
    splitBP(formData: Option[]) {
      const p: Option[] = [];
      formData.forEach((element) => {
        if (element.label === "BP") {
          const value = `${element.value}`.split("/");
          const bpSystolic = value[0];
          const bpDiastolic = value[1];

          p.push({ label: "Systolic", value: bpSystolic });
          p.push({ label: "Diastolic", value: bpDiastolic });
        }
      });
      return p;
    },
    async mapObs(vitals: any) {
      const j = vitals.map(async (element: any) => {
        const obs = await ObservationService.buildValueNumber(
          element.label,
          element.value
        );
        return obs;
      });
      return Promise.all(j);
    },
    validateVitals(vitals: any) {
      const l = this.checkRequiredVitals(vitals);
      if (l.length > 0) {
        return l.map((val) => {
          return [`${val.label} can not be empty`];
        });
      }
      const v = this.sanitizeVitals(vitals);
      return this.vitals.validateAll(v);
    },
    sanitizeVitals(vitals: Array<Option>) {
      const p = vitals.filter((element) => {
        if (element.label === "Height" && element.other.required == false) {
          return false;
        }
        return element.value !== "" && element.label !== "Age";
      });
      return [...this.splitBP(p), ...p];
    },
    checkRequiredVitals(vitals: Array<Option>) {
      return vitals.filter((element) => {
        return element.value === "" && element.other.required === true;
      });
    },
    async init(patientID: number) {
      const response: Patient = await Patientservice.findByID(patientID);
      this.patientID = patientID;
      const patient = new Patientservice(response);
      this.age = patient.getAge();
      this.gender = patient.getGender();
      const lastHeight = await patient.getRecentHeight();
      this.recentHeight = lastHeight == -1 ? null : lastHeight;
      this.vitals = new VitalsService(patientID);
      await ObservationService.getAll(patient.getID(), "Treatment status").then(
        (data) => {
          this.hasHTNObs = data && data.length > 0;
        }
      );
      await GlobalPropertyService.isHTNEnabled().then((data) => {
        if (data && data === "true") {
          this.HTNEnabled = true;
        }
      });
      this.fields = this.getFields();
    },
    getFields(): Array<Field> {
      const recentHeight = this.recentHeight ? this.recentHeight : "";
      const HTNEnabled = this.HTNEnabled;
      const hasHTNObs = this.hasHTNObs;

      const showHeight = !(recentHeight && this.age > 18);
      return [
        {
          id: "on_htn_medication",
          helpText: "Already taking drugs for blood pressure?",
          type: FieldType.TT_SELECT,
          validation: (val: any) => Validation.required(val),
          condition() {
            return HTNEnabled && !hasHTNObs;
          },
          options: () => [
            {
              label: "Yes",
              value: "BP Drugs started",
            },
            {
              label: "No",
              value: "Not on BP Drugs",
            },
          ],
        },
        {
          id: "vitals",
          helpText: "Vitals entry",
          type: FieldType.TT_VITALS_ENTRY,
          validation: (value: any) => this.validateVitals(value),
          preset: {
            label: "Gender",
            value: this.gender,
          },
          options: () => [
            {
              label: "Weight",
              value: "",
              other: {
                modifier: "KG",
                icon: "weight",
                required: true,
              },
            },
            {
              label: "Height",
              value: `${recentHeight}`,
              other: {
                modifier: "CM",
                icon: "height",
                visible: showHeight,
                required: this.age < 18,
              },
            },
            { label: "BP", value: "", other: { modifier: "mmHG", icon: "bp" } },
            {
              label: "Temp",
              value: "",
              other: { modifier: "C", icon: "temp" },
            },
            {
              label: "SP02",
              value: "",
              other: { modifier: "%", icon: "spo2" },
            },
            {
              label: "Pulse",
              value: "",
              other: { modifier: "BPM", icon: "pulse-rate" },
            },
            {
              label: "Age",
              value: this.age,
              other: { modifier: "Years old", icon: "", visible: false },
            },
          ],
        },
      ];
    },
  },
});
</script>

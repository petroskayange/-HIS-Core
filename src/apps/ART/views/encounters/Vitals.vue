<template>
  <his-standard-form
    :fields="fields"
    :activeField="activeField"
    @onskip="activeField = ''"
    @onFinish="onFinish"
    :skipSummary="true"
  >
  </his-standard-form>
</template> 
<script lang="ts">
import { defineComponent } from "vue";
import { Field } from "@/components/Forms/FieldInterface";
import { FieldType } from "@/components/Forms/BaseFormElements";
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import { Patient } from "@/interfaces/patient";
import { ProgramService } from "@/services/program_service";
import { Patientservice } from "@/services/patient_service";
import Validation from "@/components/Forms/validations/StandardValidations"
import { GlobalPropertyService } from "@/services/global_property_service";
import { ObservationService } from "@/services/observation_service";

export default defineComponent({
  components: { HisStandardForm },
  data: () => ({
    activeField: "",
    fields: [] as Array<Field>,
    patientID: '' as any,
    age: null as any,
    gender: null as any,
    hasBPinfo: false,
    recentHeight: null,
    HTNEnabled: false,
    hasHTNObs: false,
    vitals: {} as any
  }),
  created() {
    //
  },
  watch: {
      $route: {
      async handler({ query }: any) {
         this.init(query.patient_id);
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    onFinish(formData: any) {
      console.log(formData);
    },
    validateVitals(vitals: any) {

     return null 
    },
    async init(patientID: number) {
         const response: Patient = await ProgramService.getJson(
            `/patients/${patientID}`
          );
          this.patientID = patientID;
          const patient = new Patientservice(response);
          this.age = patient.getAge();
          this.gender = patient.getGender();
          const lastHeight = await patient.getRecentHeight();
          this.recentHeight = lastHeight == -1 ? null : lastHeight;

          await ObservationService.getAll(patient.getID(), 'Treatment status').then(data =>{
            this.hasHTNObs =data && data.length > 0
          })
          await GlobalPropertyService.isHTNEnabled().then(data => {
            if(data && data === 'true') {
              this.HTNEnabled = true
            }
          });
          this.fields = this.getFields();
    },
    getFields(): Array<Field> {
      const recentHeight = this.recentHeight ? this.recentHeight : ''
      const HTNEnabled = this.HTNEnabled;
      const hasHTNObs =  this.hasHTNObs;

      const showHeight =  !(recentHeight && this.age > 18);
      return [
        {
          id: "on_htn_medication",
          helpText: "Already taking drugs for blood pressure?",
          type: FieldType.TT_SELECT,
          validation: (val: any) => Validation.required(val),
          condition() {
            return HTNEnabled && !hasHTNObs
          },
          options: () => [
            {
              label: "Yes",
              value: "Yes",
            },
            {
              label: "No",
              value: "No",
            },
          ],
        },
        {
          id: "games_presentation",
          helpText: "Showing Games",
          type: FieldType.TT_VITALS_ENTRY,
          validation: (value: any) => this.validateVitals(value),
          condition(formData: any) {
            return true;
          },
          preset: {
            label: 'Gender',
            value: this.gender,
          },
          options: () => [
            {
              label: "Weight",
              value: "",
              other: {
                modifier: "KG",
                icon: "weight",
              },
            },
            {
              label: "Height",
              value: `${recentHeight}`,
              other: { modifier: "CM", icon: "height", visible: showHeight} 
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
            }
          ],
        },
      ];
    },
  },
});
</script>

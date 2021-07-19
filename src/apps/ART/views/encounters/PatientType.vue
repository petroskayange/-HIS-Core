<template>
  <his-standard-form
    :fields="fields"
    :activeField="activeField"
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

export default defineComponent({
  mixins: [EncounterMixinVue],
  components: { HisStandardForm },
  data: () => ({
    activeField: "",
    fields: [] as any,
    patientType: "" as any,
  }),
  watch: {
    $route: {
      async handler({ query }: any) {
        this.patientID = query.patient_id;
        await this.setPatientType();
        this.fields = this.getFields();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async onFinish(formData: any) {
      const pts = new PatientTypeService(this.patientID);
      const encounter = await pts.createEncounter();
      if (encounter) {
        const observations = await pts.saveValueCodedObs(
          "Type of patient",
          formData.patient_type.value
        );
        if (!observations)
          return toastWarning("Unable to save patient observations");

        toastSuccess("Observations and encounter created!");
        this.nextTask();
      } else {
        return toastWarning("Unable to create treatment encounter");
      }
    },
    async setPatientType() {
      await PatientTypeService.getAll(this.patientID, "Type of patient").then(
        async (data) => {
          if (data.length > 0) {
            this.patientType = await PatientTypeService.getConceptName(
              data[0].value_coded
            );
          }
        }
      );
    },
    getFields(): any {
      return [
        {
          id: "patient_type",
          helpText: `Current type: ${this.patientType}`,
          type: FieldType.TT_SELECT,
          validation: (val: any) =>
            Validation.required(val) ||
            Validation.notTheSame(val, this.patientType),
          options: () => [
            {
              label: "New patient",
              value: "New patient",
            },
            {
              label: "External consultation",
              value: "External consultation",
            },
          ],
        },
      ];
    },
  },
});
</script>

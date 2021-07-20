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
import { ConceptService } from "@/services/concept_service";

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
      console.log(formData);
      // const pts = new PatientTypeService(this.patientID);
      // const encounter = await pts.createEncounter();
      // if (encounter) {
      //   const observations = await pts.saveValueCodedObs(
      //     "Type of patient",
      //     formData.patient_type.value
      //   );
      //   if (!observations)
      //     return toastWarning("Unable to save patient observations");

      //   toastSuccess("Observations and encounter created!");
      //   this.nextTask();
      // } else {
      //   return toastWarning("Unable to create treatment encounter");
      // }
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
      const inclusionListArr = [
        ["Adult  18 years +", 9533],
        ["On ART for 12 months +", 9534],
        ["On 1`st line ART", 9535],
        ["Good current adherence", 9537],
        ["Last VL <1000", 9536],
        ["Pregnant / Breastfeeding", 9538],
        ["Side effects / HIV-rel. diseases", 9539],
        ["Needs BP / diabetes treatment", 9540],
        ["Started IPT <12m ago", 9527],
        ["Any sign for TB", 2186],
      ];
      const values = [
        {
          label: "yes",
          value: ConceptService.getCachedConceptID("Yes", true),
        },
        {
          label: "no",
          value: ConceptService.getCachedConceptID("No", true),
        },
      ];
      return [
        {
          id: "ft_assessment",
          helpText: `Assess client for FT`,
          type: FieldType.TT_SELECT,
          validation: (val: any) => Validation.required(val),
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
          id: "present",
          helpText: "Who is present",
          type: FieldType.TT_MULTIPLE_YES_NO,
          config: {
            showKeyboard: false,
            showSummary: false,
            eventValidation: (newValue: any) => {
              return {};
            },
          },
          condition(formData: any) {
            return formData.ft_assessment.value === "Yes";
          },
          validation: (val: any) => Validation.anyEmpty(val),
          options: () => {
            return inclusionListArr.map((data) => {
              return {
                label: data[0],
                value: "",
                other: {
                  property: "patient_present",
                  values: values,
                },
              };
            });
          },
        },
        {
          id: "book_client",
          helpText: "Book client for Fast Track",
          type: FieldType.TT_SELECT,
          condition(formData: any) {
            return formData.ft_assessment.value === "Yes";
          },
          validation: (val: any) => Validation.required(val),
          options: () => [
            {
              label: "Yes",
              value: "No",
            },
            {
              label: "No",
              value: "No",
            },
          ],
        },
      ];
    },
  },
});
</script>

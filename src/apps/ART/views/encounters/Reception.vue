<template>
  <his-standard-form
    :fields="fields"
    :activeField="activeField"
    @onFinish="onFinish"
    :skipSummary="true"
    v-if="fields.length >= 1"
  >
  </his-standard-form>
</template> 
<script lang="ts">
import { defineComponent } from "vue";
import { FieldType } from "@/components/Forms/BaseFormElements";
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import Validation from "@/components/Forms/validations/StandardValidations";
import { ConceptService } from "@/services/concept_service";
import { GlobalPropertyService } from "@/services/global_property_service";
import { ProgramService } from "@/services/program_service";
import { Patient } from "@/interfaces/patient";
import { Patientservice } from "@/services/patient_service";

export default defineComponent({
  components: { HisStandardForm },
  data: () => ({
    activeField: "",
    fields: [] as any,
    hasARVNumber: true,
    sitePrefix: "" as any,
    suggestedNumber: "" as any
  }),
  created() {
    // this.fields = this.getFields();
  },
  watch: {
    $route: {
      async handler({ query }: any) {
        if (query.patient_id) {
          const response: Patient = await ProgramService.getJson(
            `/patients/${query.patient_id}`
          );
          const patient = new Patientservice(response);
          const ARVNumber = patient.getPatientIdentifier(4);
          const extras = [];
          if (ARVNumber === "") {
            this.hasARVNumber = false;
            this.sitePrefix = await GlobalPropertyService.getSitePrefix();
            const j = await ProgramService.getNextSuggestedARVNumber();
            this.suggestedNumber = j.arv_number.replace( /^\D+/g, '');  
          }
          this.fields = this.getFields();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onfinish(formData: any) {
      console.log(formData);
    },
    getFields(): any {
      // check if patient has an arv number
      // if so get site prefix and suggested arv number
      const values = [
        {
          label: "yes",
          value: ConceptService.getCachedConceptID("Yes"),
        },
        {
          label: "no",
          value: ConceptService.getCachedConceptID("No"),
        },
      ];
      
      const extras = [];
      if (!this.hasARVNumber) {

        extras.push(
          {
            id: "conditional_data",
            helpText: "Capture ARV Number?",
            type: FieldType.TT_SELECT,
            requireNext: true,
            validation(value: any): null | Array<string> {
              return !value ? ["Value is required"] : null;
            },
            options: () => values,
          },
          {
            id: "arv_number",
            helpText: "Conditionally display next question",
            type: FieldType.TT_TEXT,
            requireNext: false,
            validation(value: any): null | Array<string> {
              return !value ? ["Value is required"] : null;
            },
            condition(formData: any) {
              return (
                formData.conditional_data.value ===
                ConceptService.getCachedConceptID("Yes")
              );
            },
            config: {
              prepend: true,
              prependValue: `${this.sitePrefix}-ARV-`,
            },
            preset: {
              label: this.suggestedNumber,
              value: this.suggestedNumber,
            },
          }
        );
      }
      // this.parsePatient(response)

      return [
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
          validation: (val: any) => Validation.neitherOr(val),
          options: () => [
            {
              label: "Patient Present",
              other: {
                property: "patient_present",
                value: "",
                values: values,
              },
            },
            {
              label: "Guardian Present",
              other: {
                property: "guardian_present",
                value: "",
                values: values,
              },
            },
          ],
        },
        ...extras
      ];
    },
  },
});
</script>

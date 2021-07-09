<template>
  <his-standard-form
    :fields="fields"
    :activeField="activeField"
    @onFinish="onFinish"
    :skipSummary="true"
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
import { EncounterService } from "@/services/encounter_service";
import { Encounter } from "@/interfaces/encounter";
import { ObservationService } from "@/services/observation_service";

export default defineComponent({
  components: { HisStandardForm },
  data: () => ({
    activeField: "",
    fields: [] as any,
    hasARVNumber: true,
    sitePrefix: "" as any,
    suggestedNumber: "" as any,
    patientID: "" as any,
  }),
  computed: {
    patientDashboard(): string {
      return `/patient/dashboard/${this.patientID}`;
    }
  },
  watch: {
    $route: {
      async handler({ query }: any) {
        if (query.patient_id) {
          const response: Patient = await ProgramService.getJson(
            `/patients/${query.patient_id}`
          );
          this.patientID = query.patient_id;
          const patient = new Patientservice(response);
          const ARVNumber = patient.getPatientIdentifier(4);
          const extras = [];
          if (ARVNumber === "") {
            this.hasARVNumber = false;
            this.sitePrefix = await GlobalPropertyService.getSitePrefix();
            const j = await ProgramService.getNextSuggestedARVNumber();
            this.suggestedNumber = j.arv_number.replace(/^\D+/g, "");
          }
          this.fields = this.getFields();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onFinish(formData: any) {
      this.createRegistrationEncounter(this.patientID)
        .then((data: Encounter) => {
          this.createRegistrationOs(data, formData.present);
        })
        .then(() => {
          if (
            !this.hasARVNumber && formData.capture_arv.value ===
            ConceptService.getCachedConceptID("Yes")
          ) {
            this.postARVNumber(`${this.sitePrefix}-ARV-${formData.arv_number.value}`)
          }
        })
        .then(() => this.$router.push(this.patientDashboard))
    },
    postARVNumber(ARVNumber: string) {
      const identifierData = {
        identifier: ARVNumber,
        'identifier_type': 4,
        'patient_id': this.patientID,
      };
      const url = "/patient_identifiers/";
      return ProgramService.postJson(url, identifierData);
    },
    createRegistrationEncounter(patientID: number) {
      return EncounterService.create({
        'encounter_type_id': 51, //TODO: get key from api or reference dictionary using name
        'patient_id': patientID,
      });
    },
    createRegistrationOs(encounter: Encounter, present: any) {
      const patientPresentConcept =  ConceptService.getCachedConceptID("Patient present");
      const guardianPresentConcept =  ConceptService.getCachedConceptID("Guardian present");
      const getValue = (key: string) =>{
        const j = present.filter((val: any) => val.other.property === key);
        return j[0].other.value; 
      }
      const obs = {
        'encounter_id': encounter.encounter_id,
        observations: [
          { 'concept_id': patientPresentConcept, 'value_coded': getValue('patient_present') },
          { 'concept_id': guardianPresentConcept, 'value_coded': getValue('guardian_present') },
        ],
      };
      return ObservationService.create(obs);
    },
    getFields(): any {
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
            id: "capture_arv",
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
            validation(value: any): null | Array<string> {
              return !value ? ["Value is required"] : null;
            },
            condition(formData: any) {
              return (
                formData.capture_arv.value ===
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
        ...extras,
      ];
    },
  },
});
</script>

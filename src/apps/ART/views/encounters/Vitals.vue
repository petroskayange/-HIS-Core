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
import MonthOptions from "@/components/FormElements/Presets/MonthOptions";

export default defineComponent({
  components: { HisStandardForm },
  data: () => ({
    activeField: "",
    fields: [] as Array<Field>,
  }),
  created() {
    this.fields = this.getFields();
  },
  methods: {
    onFinish(formData: any) {
      console.log(formData);
    },
    getFields() {
      return [
        {
          id: "on_htn_medication",
          helpText: "Already taking drugs for blood pressure?",
          type: FieldType.TT_SELECT,
          validation(value: any): null | Array<string> {
        //     return !value ? ["Value is required"] : null;
		return null
          },
          condition(formData: any) {
            return true;
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
          validation(value: any): null | Array<string> {
		return null
          },
          condition(formData: any) {
            return true;
          },
          options: () => [
            {
              label: "No Games",
              value: "No Games",
            },
          ],
        },
      ];
    },
  },
});
</script>

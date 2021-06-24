<template>
  <his-standard-form :fields="fields" @onSubmit="onSubmit" @onFinish="onFinish" :skipSummary="true"/>
</template> 
<script lang="ts">
import { defineComponent } from "vue";
import { FieldType } from "@/components/Forms/BaseFormElements"
import { GlobalPropertyService } from "@/services/global_property_service"
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import { Patientservice } from "@/services/patient_service"
import { toastWarning } from "@/utils/Alerts"
export default defineComponent({
  components: { HisStandardForm },
  methods: {
    onFinish(formData: any) {
      //
    },
    onSubmit() {
      console.log("Form has been submitted");
    },
  },
  data() {
    return {
      fields: [
        {
          id: "identifier_type",
          helpText: "ENABLE DDE",
          type: FieldType.TT_YES_NO,
          config: {
            showKeyboard: false,
          },
          requireNext: false,
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          },
          options: ()=>([
            {
              label: "Enable DDE",
              value: "enable DDE",
            },
          ]),
        }
      ],
    };
  },
  mounted() {
    //
  }
});
</script>

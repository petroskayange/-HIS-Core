
<template>
  <his-standard-form
    :fields="fields"
    @onSubmit="onSubmit"
    @onFinish="onFinish"
    :skipSummary="true"
    v-if="fields.length > 0"
  />
</template> 
<script lang="ts">
import { defineComponent } from "vue";
import { FieldType } from "@/components/Forms/BaseFormElements";
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import { GlobalPropertyService } from "@/services/global_property_service";
import { toastSuccess } from "@/utils/Alerts";

export default defineComponent({
  components: { HisStandardForm },
  methods: {
    onFinish(formData: any) {
      const sitePrefix = `${formData.htn_age.value}`.toUpperCase();
      GlobalPropertyService.set(this.property, sitePrefix)
        .then(() => toastSuccess("Property set"))
        .then(() => this.$router.push("/"));
    },
    onSubmit() {
      //      ;
    },
    async setFields() {
      const val = await GlobalPropertyService.get(this.property);
      console.log(val);
      this.fields = [
        {
          id: "htn_age",
          helpText: "Enter HTN age Threshold",
          preset: {
            label: val,
            value: val,
          },
          type: FieldType.TT_TEXT,
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          },
        },
      ];
    },
  },
  data() {
    return {
      fields: [] as any,
      property: "htn.screening.age.threshold",
    };
  },
  watch: {
    $route: {
      async handler({ query }: any) {
        this.setFields();
      },
      deep: true,
      immediate: true,
    },
  },
});
</script>


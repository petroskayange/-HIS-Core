
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
import { toastSuccess, toastWarning } from "@/utils/Alerts";
import Validation from "@/components/Forms/validations/StandardValidations"

export default defineComponent({
  components: { HisStandardForm },
  methods: {
    onFinish(formData: any) {
      const children = formData.children.map((data: { label: any }) => {
        return data.label
      }).join(); 
      const adults = formData.adults.map((data: { label: any }) => {
        return data.label
      }).join();
      GlobalPropertyService.set('clinic.days', adults)
        .then(() => GlobalPropertyService.set('peads.clinic.days', children))
        .then(() => toastSuccess('Property Set'))
        .then(() => this.$router.push("/"))
        .catch(() => toastWarning('Could not set property'))
    },
    async getActivities(property: string) {
      const val = await GlobalPropertyService.get(property);
        return this.days.map((el) => {
          
          if (val.search(el.value) >= 0) {
            el.isChecked = true;
          }
          return el;
        });
    },
    async setFields() {
      const days = [...this.days]; 
      this.fields = [
        {
          id: "adults",
          helpText: "Clinic days (adults: 18 yrs and over)",
          type: FieldType.TT_MULTIPLE_SELECT,
          config: {
            showKeyboard: false
          },
          validation: (val: any) => Validation.required(val),
          options:()=> (days),
        },
        {
          id: "children",
          helpText: "Clinic days (children: Under 18 yrs)",
          type: FieldType.TT_MULTIPLE_SELECT,
          config: {
            showKeyboard: false
          },
          validation: (val: any) => Validation.required(val),
          options:()=> (days),
        }
      ];
    },
  },
  data() {
    return {
      fields: [] as any,
      property: "site_prefix",
      days: [
            {
              label: "Sunday",
              value: "Sunday",
              isChecked: false,
            },
            {
              label: "Monday",
              value: "Monday",
              isChecked: false,
            },
            {
              label: "Tuesday",
              value: "Tuesday",
              isChecked: false,
            },
            {
              label: "Wednesday",
              value: "Wednesday",
              isChecked: false,
            },
            {
              label: "Thursday",
              value: "Thursday",
              isChecked: false,
            },
            {
              label: "Friday",
              value: "Friday",
              isChecked: false,
            },
            {
              label: "Saturday",
              value: "Saturday",
              isChecked: false,
            }
          ]
    };
  },
  watch: {
    $route: {
      async handler() {
        this.setFields();
      },
      deep: true,
      immediate: true,
    },
  },
});
</script>


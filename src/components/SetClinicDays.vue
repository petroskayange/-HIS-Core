
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
      console.log(children);
      // const sitePrefix = `${formData.site_code.value}`.toUpperCase();
      GlobalPropertyService.set('clinic.days', adults)
        .then(() => GlobalPropertyService.set('peads.clinic.days', children))
        .then(() => toastSuccess('Property Set'))
        .then(() => this.$router.push("/"))
        .catch(() => toastWarning('Could not set property'))
    },
    onSubmit() {
      //      ;
    },
    async getActivities(property: string) {
      //
      const val = await GlobalPropertyService.get(property);
    
        //
        return this.days.map((el) => {
          
          if (val.search(el.value) >= 0) {
            // el.isChecked = true;
            // set the preset here
            console.log(el.value);
            console.log(val);
          }
          return el;
        });
    },
    async setFields() {
      // const Adultdays = await this.getActivities('clinic.days'); 
      // console.log(Adultdays);
      const days = [...this.days]; 
      this.fields = [
        {
          id: "adults",
          helpText: "Clinic days (adults: 18 yrs and over)",
          type: FieldType.TT_MULTIPLE_SELECT,
          config: {
            showKeyboard: false
          },
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          },
          options:()=> (days),
        },
        {
          id: "children",
          helpText: "Clinic days (children: Under 18 yrs)",
          type: FieldType.TT_MULTIPLE_SELECT,
          config: {
            showKeyboard: false
          },
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          },
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
            },
            {
              label: "Monday",
              value: "Monday",
            },
            {
              label: "Tuesday",
              value: "Tuesday",
            },
            {
              label: "Wednesday",
              value: "Wednesday",
            },
            {
              label: "Thursday",
              value: "Thursday",
            },
            {
              label: "Friday",
              value: "Friday",
            },
            {
              label: "Saturday",
              value: "Saturday",
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


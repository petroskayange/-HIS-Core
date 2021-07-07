
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
import { LocationService } from "@/services/location_service";
import { Field, Option } from "@/components/Forms/FieldInterface"
import Validation from "@/components/Forms/validations/StandardValidations"
export default defineComponent({
  components: { HisStandardForm },
  methods: {
    onFinish(formData: any) {
      console.log(formData);
      // const siteLocation = `${formData.location.other.id}`.toUpperCase();
      // GlobalPropertyService.set(this.property, siteLocation)
      //   .then(() => toastSuccess("Property set"))
      //   .then(() => this.$router.push("/"));
    },
    onSubmit() {
      //      ;
    },
    async setFields() {
      const val = await GlobalPropertyService.get(this.property);
      this.fields = [
           {
                id: 'location',
                helpText: 'Please select facility name',
                type: FieldType.TT_SELECT,
                group: 'person',
                config: {
                    showKeyboard: true
                },
              
              validation: (val: any) => Validation.required(val),
                options: () => this.getFacilities()
            },
      ];
    },
  async getFacilities(): Promise<Option[]> {
        const facilities = await LocationService.getFacilities()
        return facilities.map((facility: any) => ({
          // 
            label: facility.name,
            value: facility.location_id,
            other: {
                id: facility.location_id
            }
        }))
    },
  },
  data() {
    return {
      fields: [] as any,
      property: "current_health_center_id",
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


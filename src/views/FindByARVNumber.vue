<template>
  <his-standard-form :fields="fields" @onSubmit="onSubmit" @onFinish="onFinish" :skipSummary="true"/>
</template> 
<script lang="ts">
import { defineComponent } from "vue";
import { FieldType } from "@/components/Forms/BaseFormElements"
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import ApiClient from "@/services/api_client";
export default defineComponent({
  components: { HisStandardForm },
  methods: {
    onFinish(formData: any) {
      const ARVNumber = this.fields[1].config.prependValue + formData.arv_number.value;
      this.fetchclient(ARVNumber);
    },
    onSubmit() {
      console.log("Form has been submitted");
    },
    getSitePrefix: async function() {
      const response = await ApiClient.get(
        "global_properties?property=site_prefix"
      );

      if (!response || response.status !== 200) return; // NOTE: Targeting Firefox 65, can't `response?.status`

      const data = await response.json();
      this.fields[1].config.prependValue = `${data.site_prefix}-ARV-`;
    },
    fetchclient: async function(arvNumber: string) {
      const response = await ApiClient.get(
        `search/patients/by_identifier?type_id=4&identifier=${arvNumber}`
      );

      if (!response || response.status !== 200) return; // NOTE: Targeting Firefox 65, can't `response?.status`

      const data = await response.json();
      if(data.length == 0) {
        ApiClient.showMessage('Client not found');
      }else if (data.length == 1){
        // get all the patients identifiers, check if they have a national idd
        //if they have one go to to search page
        // if not assign one to them
        const identifiers  = data[0].patient_identifiers.filter((identifier: any) => {
          return identifier.type.name.match(/National ID|Old Identification/i);
        });
        if(identifiers.length == 0) {
          //assign national health ID here
          this.$router.push(`/patients/confirm?person_id=${data[0].patient_id}`);
        }else {
          this.$router.push(`/patients/confirm?person_id=${data[0].patient_id}`);
        }
        
      }else if(data.length > 1) {
        //do duplicates page here
      }
      // const clientID = data[0]
      // console.log(data);
      // this.fields[0].prependValue = `${data.site_prefix}-ARV-`;
    }
  },
  data() {
    return {
      fields: [
        {
          id: "identifier_type",
          helpText: "Select identifier type",
          type: FieldType.TT_SELECT,
          config: {
            showKeyboard: false,
          },
          requireNext: false,
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          },
          options: ()=>([
            {
              label: "ARV Number",
              value: "ARV Number",
            },
          ]),
        },
        {
          id: "arv_number",
          helpText: "ARV Number",
          type: FieldType.TT_TEXT,
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          },
          config: {
          prepend: true,
          prependValue: "ARV"
          },
          disabled: true,
        },
      ],
    };
  },
  mounted() {
    this.getSitePrefix();
  }
});
</script>

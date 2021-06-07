<template>
  <his-standard-form :fields="fields" :skipSummary="true" @onSubmit="onSubmit" @onFinish="onFinish"/>
</template> 

<script lang="ts">
import { defineComponent } from "vue";
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field } from "@/components/Forms/FieldInterface"
import { Option } from "@/components/Forms/FieldInterface"
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import StdValidaton from "@/components/Forms/validations/StandardValidations"
import Person from "@/services/Person"

export default defineComponent({
  components: { HisStandardForm },
  data: () => ({
    fields: [] as Array<Field>
  }),
  created(){
    this.fields = this.getFields()
  },
  methods: {
    onFinish(formData: any) {
      console.log(formData)
    },
    onSubmit() {
      console.log("Form has been submitted");
    },
    mapToOption(listOptions: Array<string>): Array<Option> {
        return listOptions.map((item: any) => ({
            label: item,
            value: item
        })) 
    },
    getFields: function(): Array<Field> {
      return [
        {
          id: 'given_name',
          helpText: 'First name',
          type: FieldType.TT_TEXT,
          validation: (value: any) => StdValidaton.isName(value),
          options: async (form: any) => {
            if (!form.given_name || form.given_name.value === null) return []

            const names = await Person.searchGivenName(form.given_name.value)
            return this.mapToOption(names)
          }
        },
        {
          id: 'family_name',
          helpText: "Last name",
          type: FieldType.TT_TEXT,
          validation: (value: any) => StdValidaton.isName(value),
          options: async (form: any) => {
            if (!form.family_name || form.family_name.value === null) return []

            const names = await Person.searchFamilyName(form.family_name.value)
            return this.mapToOption(names)
          }
        },
        {
          id: 'gender',
          helpText: 'Gender',
          type: FieldType.TT_SELECT,
          validation: (value: any) => StdValidaton.required(value),
          options: () => ([
            { 
                label: 'Male',
                value: 'M'
            },
            {
                label: 'Female',
                value: 'F'
            }
          ])
        },
      ]
    }
  }
})
</script>
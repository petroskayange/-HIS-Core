<template>
  <his-standard-form :fields="fields" :skipSummary="true" @onSubmit="onSubmit" @onFinish="onFinish"/>
</template> 

<script lang="ts">
import { defineComponent } from "vue";
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field } from "@/components/Forms/FieldInterface"
import { Option } from "@/components/Forms/FieldInterface"
import { PersonService } from "@/services/person_service"
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import Validaton from "@/components/Forms/validations/StandardValidations"

export default defineComponent({
  components: { HisStandardForm },
  data: () => ({
    fields: [] as Array<Field>,
    form: {} as Record<string, Option> | Record<string, null>
  }),
  created(){
    this.fields = this.getFields()
  },
  methods: {
    onFinish(form: Record<string, Option> | Record<string, null>) {
      this.form = form
    },
    onSubmit() {
      const data: Record<string, string> = this.resolveData(this.form)
      this.$router.push({path: '/search_results', query: data})
    },
    resolveData(form: Record<string, Option> | Record<string, null>) {
      const output: any = {} 
      for(const name in form) {
        const data = form[name]
        if (data && data.value != null) output[name] = data.value
      }
      return output
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
          validation: (value: any) => Validaton.isName(value),
          options: async (form: any) => {
            if (!form.given_name || form.given_name.value === null) return []

            const names = await PersonService.searchGivenName(form.given_name.value)
            return this.mapToOption(names)
          }
        },
        {
          id: 'family_name',
          helpText: "Last name",
          type: FieldType.TT_TEXT,
          validation: (value: any) => Validaton.isName(value),
          options: async (form: any) => {
            if (!form.family_name || form.family_name.value === null) return []

            const names = await PersonService.searchFamilyName(form.family_name.value)
            return this.mapToOption(names)
          }
        },
        {
          id: 'gender',
          helpText: 'Gender',
          type: FieldType.TT_SELECT,
          validation: (value: any) => Validaton.required(value),
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
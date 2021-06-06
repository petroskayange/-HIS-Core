<template>
  <his-standard-form :fields="fields" @onSubmit="onSubmit" @onFinish="onFinish"/>
</template> 

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field } from "@/components/Forms/FieldInterface"
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";

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
    getFields: (): Array<Field> => ([
        {
          id: 'given_name',
          helpText: 'First name',
          type: FieldType.TT_TEXT
        },
        {
          id: 'family_name',
          helpText: "Last name",
          type: FieldType.TT_TEXT
        },
        {
          id: 'gender',
          helpText: 'Gender',
          type: FieldType.TT_SELECT,
          requireNext: false,
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
    ])
  }
})
</script>
<template>
  <his-standard-form 
    :fields="fields" 
    :activeField="activeField" 
    @onskip="activeField=''"
    @onSubmit="onSubmit" 
    @onFinish="onFinish"> 
  </his-standard-form>
</template> 
<script lang="ts">
import { defineComponent } from "vue";
import { Field } from "@/components/Forms/FieldInterface"
import { FieldType } from "@/components/Forms/BaseFormElements"
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import MonthOptions from "@/components/FormElements/Presets/MonthOptions"

export default defineComponent({
  components: { HisStandardForm },
  data: () => ({
    activeField: '',
    fields: [] as Array<Field>
  }),
  created() {
    this.fields = this.getFields()
  },
  methods: {
    onFinish(formData: any) {
      console.log(formData)
    },
    getFields(): Array<Field> {
      return [
        {
          id: "name_field",
          helpText: "What is your name",
          type: FieldType.TT_TEXT,
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          }
        },
        {
          id: "patient_chart",
          helpText: "Patient Chart",
          type: FieldType.TT_WEIGHT_CHART,
          options: () => ([{
            label: 'Patient weight',
            value: 54,
            other: {
              labels: ['10 Jan', '11 June', '8 Aug'],
              values: [65, 38, 89, 57]
            }
          }])
        },
        {
          id: "custom_btn",
          helpText: "Show custom button",
          type: FieldType.TT_TEXT,
          config: {
            footerBtns: [
              {
                name: 'Void',
                color: 'danger',
                size: 'large',
                visible: false,
                slot: '',
                visibleOnStateChange: (state: any) => {
                  return state.index === 1
                },
                onClick: () => {
                  alert('Record has been voided!')
                }
              },
              {
                name: 'Custom Something',
                color: 'primary',
                size: 'large',
                visible: false,
                slot: 'end',
                visibleOnStateChange: (state: any) => {
                  return state.index === 1
                },
                onClick: () => {
                  alert('YaY! Custom Button Clicked')
                }
              },
            ]
          }
        },
        {
          id: 'hide_default_btns',
          helpText: 'Default buttons have been hidden',
          type: FieldType.TT_TEXT,
          config: {
            hiddenFooterBtns: [
              'Clear',
              'Cancel'
            ]
          }
        },
        {
          id: 'skip_next_field',
          helpText: 'Skip Next Field with custom button',
          type: FieldType.TT_TEXT,
          config: {
            footerBtns: [
              {
                name: 'Skip Dates',
                color: 'light',
                size: 'large',
                visible: false,
                slot: 'end',
                visibleOnStateChange: (state: any) => {
                  return state.index === 3
                },
                onClick: () => {
                  this.activeField = 'multiple_select'
                }
              }
            ]
          }
        },
        {
          id: "year",
          helpText: "Year of birth",
          type: FieldType.TT_NUMBER
        },
        {
          id: "month",
          helpText: "Month of birth",
          type: FieldType.TT_SELECT,
          requireNext: false,
          options: () => MonthOptions,
          config: {
            showKeyboard: false
          }
        },
        {
          id: "day",
          helpText: "Day of birth",
          type: FieldType.TT_MONTHLY_DAYS
        },
        {
          id: "multiple_select",
          helpText: "Select Multiple values",
          type: FieldType.TT_MULTIPLE_SELECT,
          config: {
            showKeyboard: false
          },
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          },
          options:()=> ([
            {
              label: "Foo",
              value: "Foo",
            },
            {
              label: "Baz",
              value: "Baz",
            },
            {
              label: "Bar",
              value: "Bar",
            },
            {
              label: "Foo",
              value: "Foo",
            },
            {
              label: "Baz",
              value: "Baz",
            },
            {
              label: "Bar",
              value: "Bar",
            }
          ]),
        },
        {
          id: "conditional_data",
          helpText: "Conditionally display next question",
          type: FieldType.TT_SELECT,
          requireNext: false,
          validation(value: any): null | Array<string>{
            return !value ? ["Value is required"] : null;
          },
          options: ()=> ([
            {
              label: "Show Games",
              value: "Show Games",
            },
            {
              label: "Show Music",
              value: "Show Music",
            },
          ]),
        },
        {
          id: "music_presentation",
          helpText: "Showing Music",
          type: FieldType.TT_SELECT,
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          },
          condition(formData: any) {
            return formData.conditional_data.value === "Show Music";
          },
          options: ()=> ([
            {
              label: "No Music",
              value: "No Music",
            },
          ]),
        },
        {
          id: "games_presentation",
          helpText: "Showing Games",
          type: FieldType.TT_SELECT,
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          },
          condition(formData: any) {
            return formData.conditional_data.value === "Show Games";
          },
          options: ()=>([
            {
              label: "No Games",
              value: "No Games",
            },
          ]),
        },
        {
          id: "does_not_require_next",
          helpText: "Click on value to proceed",
          type: FieldType.TT_SELECT,
          requireNext: false,
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          },
          options: ()=>([
            {
              label: "Duke",
              value: "Duke",
            },
            {
              label: "Dork",
              value: "Dork",
            },
          ]),
        },
        {
          id: "option_params",
          helpText: "Console.log Prop sent via options",
          type: FieldType.TT_SELECT, 
          options: (fdata: any) => {
            console.log(fdata)
            return []
          }
        },
        {
          id: "validated",
          helpText: "Value is Required before next",
          type: FieldType.TT_SELECT,
          validation(value: any): null | Array<string> {
            return !value ? ["Value is required"] : null;
          },
          options: ()=>([
            {
              label: "Fur",
              value: "Fur",
            },
            {
              label: "Fume",
              value: "Fame",
            },
          ]),
        },
      ]
    }
  }
});
</script>

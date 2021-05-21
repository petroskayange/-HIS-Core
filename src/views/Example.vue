<template>
  <ion-page>
    <wizard-form
      :fields="fields"
      :next="isNext"
      :prev="isPrev"
      @onErrors="onErrors"
      @onNext="updateNext"
      @onPrev="updatePrev"
      @onFinish="onFinish"
    />
    <his-footer
      @onCancel="onCancel"
      @onNext="isNext=true"
      @onBack="isPrev=true"
      @onFinish="onSubmit"
    ></his-footer>
  </ion-page>
</template>
<script>
import WizardForm from "@/components/Forms/WizardForm.vue";
import HisFooter from "@/components/HisNavFooter.vue";
import { defineComponent } from "vue";
import { IonPage } from "@ionic/vue";
import { FieldType } from "@/components/Forms/FieldType";
export default defineComponent({
  components: { WizardForm, IonPage, HisFooter },
  methods: {
    onErrors(errors){
      alert(errors.join(', '))
    },
    onCancel(){
      this.$router.push({path: "/"})
    },
    onFinish(data) {
      console.log(data)
    },
    updateNext(field) {
      this.isNext = false
      console.log(`Next: ${JSON.stringify(field)}`)
    },
    updatePrev(field) {
      this.isPrev = false
      console.log(`Prev: ${JSON.stringify(field)}`)
    },
    onSubmit() {
      console.log('Form was submitted')
    }
  },
  data() {
    return {
      isNext: false,
      isPrev: false,
      fields: [
        {
          id: "multiple_select",
          helpText: "Select Multiple values",
          type: FieldType.TT_MULTIPLE_SELECT,
          validation(value) {
            return !value ? ['Value is required']: null
          },
          options: [
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
          ],
        },
        {
          id: 'conditional_data',
          helpText: "Conditionally display next question",
          type: FieldType.TT_SELECT,
          validation(value) {
            return !value ? ['Value is required']: null
          },
          options: [
            {
              label: "Show Games",
              value: "Show Games"
            },
            {
              label: "Show Music",
              value: "Show Music"
            }
          ]
        },
        {
          id: 'music_presentation',
          helpText: 'Showing Music',
          type: FieldType.TT_SELECT,
          validation(value) {
            return !value ? ['Value is required']: null
          },
          condition(formData) {
            return formData.conditional_data.value === 'Show Music' 
          },
          options: [
            {
              label: 'No Music',
              value: 'No Music'
            }
          ]
        },
        {
          id: 'games_presentation',
          helpText: 'Showing Games',
          type: FieldType.TT_SELECT,
          validation(value) {
            return !value ? ['Value is required']: null
          },
          condition(formData) {
            return formData.conditional_data.value === 'Show Games'
          },
          options: [
            {
              label: 'No Games',
              value: 'No Games'
            }
          ]
        },
        {
          id: "does_not_require_next",
          helpText: "Click on value to proceed",
          type: FieldType.TT_SELECT,
          requireNext: false,
          validation(value) {
            return !value ? ['Value is required']: null
          },
          options: [
            {
              label: "Duke",
              value: "Duke",
            },
            {
              label: "Dork",
              value: "Dork",
            },
          ],
        },
        {
          id: "validated",
          helpText: "Value is Required before next",
          type: FieldType.TT_SELECT,
          validation(value) {
            return !value ? ['Value is required']: null
          },
          options: [
            {
              label: "Fur",
              value: "Fur",
            },
            {
              label: "Fume",
              value: "Fame",
            },
          ],
        }
      ],
    };
  }
});
</script>

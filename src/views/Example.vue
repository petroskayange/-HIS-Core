<template>
  <ion-page>
    <base-form
      :fields="fields"
      :next="isNext"
      :prev="isPrev"
      :clear="isClear"
      @onClear="isClear=false"
      @onErrors="onErrors"
      @onNext="updateNext"
      @onPrev="updatePrev"
      @onFinish="onFinish"
    />
    <his-footer
      :showBack="showBack"
      :showNext="showNext"
      :showFinish="showFinish"
      :showClear="true"
      @onCancel="onCancel"
      @onClear="isClear=true"
      @onNext="isNext=true"
      @onBack="isPrev=true"
      @onFinish="onSubmit"
    ></his-footer>
  </ion-page>
</template>
<script>
import BaseForm from "@/components/Forms/BaseForm.vue";
import HisFooter from "@/components/HisNavFooter.vue";
import { defineComponent } from "vue";
import { IonPage } from "@ionic/vue";
import { FieldType } from "@/components/Forms/FieldType";
export default defineComponent({
  components: { BaseForm, IonPage, HisFooter },
  methods: {
    onErrors(errors){
      alert(errors.join(', '))
    },
    onCancel(){
      this.$router.push({path: "/"})
    },
    onFinish() {
      this.showFinish = true
      this.showNext = false
    },
    updateNext({ index }) {
      this.isNext = false
      if (index >= 1) this.showBack = true
    },
    updatePrev({ index }) {
      this.isPrev = false
      this.showNext = true
      this.showFinish = false
      if (index === 0) this.showBack = false
    },
    onSubmit() {
      console.log('Form was submitted')
    }
  },
  data() {
    return {
      showNext: true,
      showBack: false,
      showFinish: false,
      isClear: false,
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
          requireNext:false,
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

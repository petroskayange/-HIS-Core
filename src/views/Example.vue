<template>
  <ion-page>
    <wizard-form
      :fields="fields"
      :next="isNext"
      :prev="isPrev"
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
  data() {
    return {
      isNext: false,
      isPrev: false,
      fields: [
        {
          id: "1234",
          helpText: "My Name",
          type: FieldType.TT_SELECT,
          requireNext: false,
          options: [
            {
              label: "Andrew Mfune",
              value: "Andrew Mfune",
            },
            {
              label: "Yewo Mfune",
              value: "Yewo Mfune",
            },
          ],
        },
        {
          id: "1234",
          helpText: "My Name",
          type: FieldType.TT_SELECT,
          options: [
            {
              label: "Thom Mfune",
              value: "Thom Mfune",
            },
            {
              label: "Khetase Mfune",
              value: "Khetase Mfune",
            },
          ],
        }
      ],
    };
  },
  methods: {
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
});
</script>

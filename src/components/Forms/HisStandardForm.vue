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
      :showBack="showPrevBtn"
      :showNext="showNextBtn"
      :showFinish="showFinishBtn"
      :showClear="true"
      @onCancel="onCancel"
      @onClear="isClear=true"
      @onNext="isNext=true"
      @onBack="isPrev=true"
      @onFinish="onSubmit"
    ></his-footer>
  </ion-page>
</template>
<script lang="ts">
import BaseForm from "@/components/Forms/BaseForm.vue";
import HisFooter from "@/components/HisNavFooter.vue";
import { Field } from "./FieldType";
import { defineComponent, PropType } from "vue";
import { IonPage } from "@ionic/vue";

export default defineComponent({
    components: { BaseForm, IonPage, HisFooter },
    props: {
        fields: {
            type: Object as PropType<Field[]>
        },
        cancelDestinationPath: {
            type: String,
            required: false,
            default: () => '/'
        }
    },
    data:()=>({
      showNextBtn: true,
      showPrevBtn: false,
      showFinishBtn: false,
      isClear: false,
      isNext: false,
      isPrev: false,
    }),
    methods: {
        onErrors(errors: Array<string>) {
            alert(errors.join(', '))
        },
        onCancel(){
            const confirmation = confirm('Are you sure you want to cancel?') 
            if (confirmation) {
                this.$router.push({path: this.cancelDestinationPath})
            }
        },
        onFinish(formData: any) {
            this.showFinishBtn = true
            this.showNextBtn = false
            this.$emit('onFinish', formData)
        },
        updateNext({ field, index }: any): void {
            this.isNext = false
            
            if (index >= 1) this.showPrevBtn = true
            
            this.$emit('onNext', field)
        },
        updatePrev({ field, index }: any): void {
            this.isPrev = false
            this.showNextBtn = true
            this.showFinishBtn = false
            
            if (index === 0) this.showPrevBtn = false
            
            this.$emit('onPrev', field)
        },
        onSubmit(): void {
            this.$emit('onSubmit')
        }
    }
})
</script>

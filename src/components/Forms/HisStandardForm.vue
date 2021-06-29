<template> 
  <ion-page>
    <ion-content>
    <div v-if="showSummary">
        <h3><b>Summary</b> </h3>
        <his-form-summary :fieldItems="summaryData" />
    </div>
    <div v-show="!showSummary">
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
    </div>
    </ion-content>
    <his-footer
      :showBack="showPrevBtn"
      :showNext="showNextBtn"
      :showFinish="showFinishBtn"
      :showClear="showClearBtn"
      @onCancel="onCancel"
      @onClear="onClear"
      @onNext="isNext=true"
      @onBack="onBack"
      @onFinish="onSubmit"
    ></his-footer>
  </ion-page>
</template>
<script lang="ts">
import BaseForm from "@/components/Forms/BaseForm.vue";
import HisFooter from "@/components/HisNavFooter.vue";
import HisFormSummary from "@/components/DataViews/HisFormSummary.vue"
import { Option } from "@/components/Forms/FieldInterface"
import { Field } from "./FieldInterface";
import { defineComponent, PropType } from "vue";
import { IonPage, IonContent } from "@ionic/vue";
import { alertConfirmation, toastWarning } from "@/utils/Alerts"
export default defineComponent({
    name: "HisStandardForm",
    components: { BaseForm, IonPage, IonContent, HisFooter, HisFormSummary },
    props: {
        skipSummary: {
            type: Boolean,
            default: () => false
        },
        fields: {
            type: Object as PropType<Field[]>,
            required: true
        },
        cancelDestinationPath: {
            type: String,
            required: false,
            default: () => '/'
        }
    },
    data:()=>({
      formData: {} as any,
      summaryData: [] as Array<Option> | Array<Option[]>,
      showSummary: false,
      showClearBtn: true,
      showNextBtn: true,
      showPrevBtn: false,
      showFinishBtn: false,
      isClear: false,
      isNext: false,
      isPrev: false,
    }),
    created() {
        if (this.hasOneFieldOnly() && this.skipSummary) {
            this.showFinishBtn = true
            this.showNextBtn = false
        }
    },
    methods: {
        hasOneFieldOnly() {
            return this.fields.length === 1
        },
        onErrors(errors: Array<string>) {
            toastWarning(errors.join(', '), 3000)
        },
        async onCancel(){
            const confirmation = await alertConfirmation('Are you sure you want to cancel?') 
            if (confirmation) {
                this.$router.push({path: this.cancelDestinationPath})
            }
        },
        async onClear() {
            const confirmation = await alertConfirmation('Are you sure you want to clear field data?')
            if (confirmation) {
                this.isClear = true
            }
        },
        onBack(){
            if(this.showSummary) {
                this.showNextBtn = true
                this.showFinishBtn = false
                this.showClearBtn = true
                this.showSummary = false
                return
            }
            this.isPrev = true
        },
        onFinish(formData: any) {
            if (this.skipSummary) {
                this.$emit('onFinish', formData)
                this.$emit('onSubmit')
            } else { 
                this.summaryData = this.buildSummaryData(formData)
                this.showSummary = true
                this.showClearBtn = false
                this.showFinishBtn = true
                this.$emit('onFinish', formData)
            }
        },
        onSubmit(): void {
            if (this.hasOneFieldOnly() && this.skipSummary) {
                this.$emit('onFinish', this.formData)
                this.$emit('onSubmit')
                return
            }

            if (!this.skipSummary) return this.$emit('onSubmit')

            this.isNext = true
        },
        updateNext({ field, index, formData }: any): void {
            this.isNext = false
            this.formData = formData

            if (index >= 1) this.showPrevBtn = true
            
            if (this.skipSummary && index +1 >= this.fields.length) {
                this.showFinishBtn = true
                this.showNextBtn = false
                return
            }

            if (this.fieldRequiresNextBtn(field) && !this.showSummary) {
                this.showNextBtn = true
            } else {
                this.showNextBtn = false
            }

            this.$emit('onNext', field)
        },
        fieldRequiresNextBtn(field: Field): boolean{
            if (!("requireNext" in field)) return true;
            return field.requireNext ? true : false;
        },
        updatePrev({ field, index }: any): void {
            this.isPrev = false
            this.showFinishBtn = false
            
            if (this.fieldRequiresNextBtn(field)) {
                this.showNextBtn = true
            } else {
                this.showNextBtn = false
            }
            
            if (index === 0) this.showPrevBtn = false
            
            this.$emit('onPrev', field)
        },
        buildSummaryData(formData: any): Array<Option> {
            const data: Array<Option> = [];
            const resolveLabel = (fieldId: string): string => {
                const field: Field = this.fields.filter(item => item.id === fieldId)[0]
                return field.helpText
            }

            for(const ref in formData) {
                const fdata = formData[ref]
                
                if (!fdata) continue

                if (Array.isArray(fdata)) {
                    fdata.forEach(item => {
                        data.push({ label: resolveLabel(ref), value: item.label })
                    })
                    continue
                }

                data.push({ label: resolveLabel(ref), value: fdata.label})
            }
            return data
        }
    }
})
</script>

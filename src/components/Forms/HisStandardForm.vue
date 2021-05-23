<template> 
  <ion-page>
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
    <div v-if="showSummary">
        <h3><b>Summary</b> </h3>
        <his-form-summary :fieldItems="summaryData" />
    </div>
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
import { Option } from "@/components/Forms/FieldType"
import { Field } from "./FieldType";
import { defineComponent, PropType } from "vue";
import { IonPage } from "@ionic/vue";
export default defineComponent({
    name: "HisStandardForm",
    components: { BaseForm, IonPage, HisFooter, HisFormSummary },
    props: {
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
        onClear() {
            const confirmation = confirm('Are you sure you want to clear field data?')
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
            this.summaryData = this.buildSummaryData(formData)
            this.showClearBtn = false
            this.showSummary = true
            this.showFinishBtn = true
            this.$emit('onFinish', formData)
        },
        onSubmit(): void {
            this.$emit('onSubmit')
        },
        updateNext({ field, index }: any): void {
            this.isNext = false
            
            if (index >= 1) this.showPrevBtn = true
            
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

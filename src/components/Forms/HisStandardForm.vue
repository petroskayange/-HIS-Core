<template> 
  <ion-page>
    <ion-content>
        <base-form
            :fields="fields"
            :next="isNext"
            :prev="isPrev"
            :clear="isClear"
            @onFinish="onFinish"
            @onClear="isClear=false"
            @onErrors="onErrors"
            @onNext="updateNext"
            @onPrev="updatePrev"/>
    </ion-content>
    <his-footer 
        :btns="footerBtns"
        :state="{index, totalFields, onNextRequired}">
    </his-footer>
  </ion-page>
</template>
<script lang="ts">
import BaseForm from "@/components/Forms/BaseForm.vue";
import HisFooter from "@/components/HisDynamicNavFooter.vue";
import { Field } from "./FieldInterface";
import { defineComponent, PropType } from "vue";
import { IonPage, IonContent } from "@ionic/vue";
import { alertConfirmation, toastWarning } from "@/utils/Alerts"
import { NavBtnInterface } from "@/components/HisDynamicNavFooterInterface"
export default defineComponent({
    name: "HisStandardForm",
    components: { BaseForm, IonPage, IonContent, HisFooter },
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
      index: 0,
      totalFields: 0,
      onNextRequired: true,
      isClear: false,
      isNext: false,
      isPrev: false,
      footerBtns: [] as Array<NavBtnInterface>
    }),
    created() {
        this.totalFields = this.fields.length
        this.footerBtns = [
            this.cancel(),
            this.clear(),
            this.back(),
            this.next(),
            this.finish()
        ]
    },
    methods: {
        onErrors(errors: Array<string>) {
            toastWarning(errors.join(', '), 3000)
        },
        updateNext({ field, index }: any){
            this.isNext = false
            this.onNavigation(field, index)
        },
        updatePrev({ field, index }: any) {
            this.isPrev = false
            this.onNavigation(field, index)
        },
        onNavigation(field: Field, index: number) {
            this.index = index
            this.onNextRequired = field.requireNext != undefined ? field.requireNext : true
        },
        onFinish(formData: Record<string, any>) {
            this.$emit('onFinish', formData)
        },
        cancel(): NavBtnInterface {
            return {
                name: 'Cancel',
                size: 'large',
                color:'danger',
                visible: true,
                onClick: async () => {
                    const confirmation = await alertConfirmation('Are you sure you want to cancel?') 
                    
                    if (confirmation) this.$router.push({path: this.cancelDestinationPath })
                }
            }
        },
        clear(): NavBtnInterface {
            return {
                name: 'Clear',
                size: 'large',
                slot: 'end',
                color:'warning',
                visible: true,
                onClick: async () => {
                    const confirmation = await alertConfirmation('Are you sure you want to clear field data?')
        
                    if (confirmation) this.isClear = true
                }
            }
        },
        back(): NavBtnInterface {
            return {
                name: 'Back',
                size: 'large',
                slot: 'end',
                color: 'primary',
                visible: false,
                visibleOnStateChange: (state: Record<string, any>) => {
                    return state.index > 0
                },
                onClick: () => {
                    this.isPrev = true
                }
            }
        },
        next(): NavBtnInterface {
            return {
                name: 'Next',
                size: 'large',
                slot: 'end',
                color: 'primary',
                visible: this.index +1 < this.totalFields,
                visibleOnStateChange: (state: Record<string, any>) => {
                    return state.index +1 < state.totalFields && state.onNextRequired
                },
                onClick: async () => {
                    this.isNext = true
                }
            }
        },
        finish(): NavBtnInterface {
            return {
                name: 'Finish',
                size: 'large',
                slot: 'end',
                color: 'success',
                visible: false,
                visibleOnStateChange: (state: Record<string, any>) => {
                    return state.index+1 >= state.totalFields
                },
                onClick: async () => {
                    this.isNext = true
                }
            }
        }
    }
})
</script>

<template>
  <div>
    <component
      v-bind:is="activeField.type"
      :label="activeField.help_text"
      :options="activeField.options"
      @onValue="onValue"
    />
  </div>
</template>
<script lang='ts'>
import { defineComponent, PropType } from "vue";
import { Field } from "./Field";

export default defineComponent({
  name: "WizardForm",
  props: {
    next: {
        type: Boolean
    },
    prev: {
        type: Boolean
    },
    fields: {
      required: true,
      type: Object as PropType<Field[]>
    },
  },
  data() {
    return {
      activeIndex: 0,
      formData: {} as any,
      activeField: {} as Field,
    };
  },
  methods: { 
    isCondition(field: Field): Boolean {
        if ('condition' in field) {
            return field.condition(this.formData)
        }
        return true
    },
    isValidation(value: String, field: Field) {
        if ('validation' in field) {
            return field.validation(value, this.formData)
        }
        return true
    },
    onNext() {
        const totalFields = this.fields.length
        const nextIndex = this.activeIndex + 1
        if (nextIndex < totalFields){
            this.activeIndex = nextIndex
            this.activeField = this.fields[this.activeIndex]
            if (!this.isCondition(this.activeField)) {
                this.onNext()
            }
        }
    },
    onPrev(){
        const prevIndex = this.activeIndex - 1
        if (prevIndex >= 1){
            this.activeIndex = prevIndex
            this.activeField = this.fields[this.activeIndex]
            if (!this.isCondition(this.activeField)) {
                this.onPrev()
            }
        }
    },
    onValue(value: String | number){
        this.formData[this.activeField.id] = value
    },
    onFinish(){
        this.$emit('onfinish', this.formData)
    },
  },
});
</script>

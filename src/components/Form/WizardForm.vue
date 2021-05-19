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
  mounted(){
    this.buildFormData(this.fields)
  },
  methods: {
    buildFormData(fields: Array<Field>): void {
      this.formData = {}
      fields.forEach(field => this.formData[field.id] = field)
    },
    getValue(field: Field): any {
        return this.formData[field.id]
    },
    isRequireNext(field: Field): Boolean {
        if (!field.require_next) return true

        return field.require_next ? true : false
    },
    isCondition(field: Field): Boolean {
        if (field.condition) {
            return field.condition(this.formData)
        }
        return true
    },
    validate(value: String, field: Field): null | Array<string> {
        if (field.validation) {
            return field.validation(value, this.formData)
        }
        return null
    },
    onNext(): void {
        const totalFields = this.fields.length
        const nextIndex = this.activeIndex + 1
        const errors : null | Array<string> = this.validate(
            this.getValue(this.activeField), this.formData
        )

        if (errors) return this.$emit('onErrors', errors)

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
    onValue(value: String | number) {
        this.formData[this.activeField.id] = value
        if (!this.isRequireNext(this.activeField)) {
            this.onNext()
        }
    },
    onFinish(){
        this.$emit('onfinish', this.formData)
    },
  },
});
</script>

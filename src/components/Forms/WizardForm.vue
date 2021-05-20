<template>
  <div>
    <keep-alive>
      <component
        v-bind:is="activeField.type"
        :label="activeField.helpText"
        :options="activeField.options"
        @onValue="onValue"
      />
    </keep-alive>
  </div>
</template>
<script lang='ts'>
import { defineComponent, PropType } from "vue";
import { Field } from "./FieldType";
import SingleSelect from '@/components/FormElements/HisSelect.vue'
import MultipleSelect from '@/components/FormElements/HisMultipleSelect.vue'

export default defineComponent({
  name: "WizardForm",
  components: { 
    SingleSelect, 
    MultipleSelect 
  },
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
  watch: {
    next(val: boolean){
      if (val) this.onNext(); this.$emit('onNext', this.activeField);
    },
    prev(val: boolean) {
      if (val) this.onPrev(); this.$emit('onPrev', this.activeField);
    }
  },
  mounted(){
    this.buildFormData(this.fields)
    this.activeField = this.fields[0]
  },
  methods: {
    buildFormData(fields: Array<Field>): void {
      this.formData = {}
      fields.forEach(field => this.formData[field.id] = field)
    },
    getValue(field: Field): any {
      return this.formData[field.id]
    },
    setValue(value: any, field: Field): void {
      this.formData[field.id] = value
    },
    isRequireNext(field: Field): boolean {
      if (!field.requireNext) return true

      return field.requireNext ? true : false
    },
    isCondition(field: Field): boolean {
      if (field.condition) {
        return field.condition(this.formData)
      }
      return true
    },
    validate(value: string, field: Field): null | Array<string> {
      if (field.validation) {
        return field.validation(value, this.formData)
      }
      return null
    },
    onNext(): void {
      const totalFields = this.fields.length
      const nextIndex = this.activeIndex + 1
      const errors: null | Array<string> = this.validate(
        this.getValue(this.activeField), this.formData
      )

      if (errors) return this.$emit('onErrors', errors)

      if (nextIndex >= totalFields) return this.onFinish()

      this.setActiveField(nextIndex)
      
      if (!this.isCondition(this.activeField)) {
        this.setValue(null, this.activeField)
        return this.onNext()
      }
    },
    onPrev(): void {
      const prevIndex = this.activeIndex - 1
      
      if (prevIndex <= -1) return

      this.setActiveField(prevIndex)

      if (!this.isCondition(this.activeField)) {
        this.setValue(null, this.activeField)
        return this.onPrev()
      }
    },
    setActiveField(index: number){
      this.activeIndex = index
      this.activeField = this.fields[this.activeIndex]
    },
    onValue(value: string | number): void {
      this.formData[this.activeField.id] = value
      if (!this.isRequireNext(this.activeField)) {
        this.onNext()
      }
    },
    onFinish(): void {
      this.$emit('onFinish', this.formData)
    },
  },
});
</script>

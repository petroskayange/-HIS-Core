<template>
  <div>
    <h1> {{activeField.helpText}} </h1>
    <keep-alive>
      <component
        :key="activeField.id"
        v-bind:is="activeField.type"
        :config="activeField.config"
        :options="activeField.options"
        :preset="activeField.preset"
        :clear="isClear"
        :fdata="formData"
        @onClear="isClear=false"
        @onValue="onValue"
      />
    </keep-alive>
  </div>
</template>
<script lang='ts'>
import { defineComponent, PropType } from "vue";
import { Field, Option } from "./FieldInterface";
import { BaseFormComponents } from "@/components/Forms/BaseFormElements"
export default defineComponent({
  name: "BaseForm",
  components: {
    ...BaseFormComponents
  },
  props: {
    index: {
      type: Number
    },
    clear: {
      type: Boolean
    },
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
      isClear: false,
      activeIndex: 0,
      formData: {} as any,
      activeField: {} as Field,
    };
  },
  watch: {
    index(index: number) {
      if (index >= 0 && index <= this.fields.length) {
        this.setActiveField(index)
        this.emitNext()
      } 
    },
    clear(val: boolean) {
      if (val) {
        this.isClear = true
        this.setActiveFieldValue(null)
        this.$emit("onClear")
      }
    },
    next(val: boolean) {
      if (val) this.onNext();
      this.emitNext()
    },
    prev(val: boolean) {
      if (val) this.onPrev();
      this.$emit("onPrev", {field: this.activeField, index: this.activeIndex});
    },
  },
  mounted() {
    this.buildFormData(this.fields);
    this.activeField = this.fields[0];
  },
  methods: {
    buildFormData(fields: Array<Field>): void {
      this.formData = {};
      fields.forEach((field) => (this.formData[field.id] = null));
    },
    getActiveFieldValue(): any {
      return this.formData[this.activeField.id];
    },
    setActiveFieldValue(value: any): void {
      this.formData[this.activeField.id] = value;
    },
    activeFieldRequiresNext(): boolean {
      if (!("requireNext" in this.activeField)) return true;

      return this.activeField.requireNext ? true : false;
    },
    activeFieldConditionPassed(): boolean {
      if (this.activeField.condition) 
        return this.activeField.condition(this.formData);
      return true;
    },
    emitActiveFieldValidationErrors(){
      if (!this.activeField.validation) return

      const val = this.getActiveFieldValue()
      const errors = this.activeField.validation(val, this.formData)

      if (errors) {
        this.$emit("onErrors", errors);
        return true
      }
    },
    onNext(skipValidation = false): void {
      const originalIndex = this.activeIndex
      const totalFields = this.fields.length;
      const nextIndex = originalIndex + 1;

      if (!skipValidation && this.emitActiveFieldValidationErrors()) return

      if (nextIndex >= totalFields) return this.onFinish();

      this.setActiveField(nextIndex);

      if (!this.activeFieldConditionPassed()) {
        this.setActiveFieldValue(null);
        // Rivert to previous field if this is the last field and finish
        if (nextIndex + 1 >= totalFields) {
          this.setActiveField(originalIndex)
          return this.onFinish()
        }
        this.onNext(true);
      } 
    },
    onPrev(): void {
      const prevIndex = this.activeIndex - 1;

      if (prevIndex <= -1) return;

      this.setActiveField(prevIndex);

      if (this.activeFieldConditionPassed()) return 

      this.setActiveFieldValue(null);
      this.onPrev();
    },
    setActiveField(index: number) {
      this.activeIndex = index;
      this.activeField = this.fields[this.activeIndex];
    },
    onValue(value: string | number | Option | Array<Option>): void {
      this.setActiveFieldValue(value);

      if (this.fields.length === 1) return this.emitNext() 

      if (!this.activeFieldRequiresNext()) this.onNext(), this.emitNext();
    },
    emitNext() {
      this.$emit("onNext", {
        field: this.activeField, 
        index: this.activeIndex, 
        formData: this.formData
      });
    },
    onFinish(): void {
      this.$emit("onFinish", this.formData);
    }
  },
});
</script>
<style scoped>
  h1 {
    font-weight:bold
  }
</style>
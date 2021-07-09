<template>
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
</template>
<script lang='ts'>
import { defineComponent, PropType } from "vue";
import { Field, Option } from "./FieldInterface";
import { BaseFormComponents } from "@/components/Forms/BaseFormElements"
import { isEmpty } from "lodash"
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
    index: {
      handler(index: number) {
        if (index >= 0 && index <= this.fields.length) {
          this.activeIndex = index
          this.onNext()
        }
      },
      immediate: true
    },
    clear(val: boolean) {
      if (val) {
        this.isClear = true
        this.setActiveFieldValue(null)
        this.$emit("onClear")
      }
    },
    next(val: boolean): void {
      if (val) {
        if (this.activeField.validation) {
          const value = this.formData[this.activeField.id]
          const errors = this.activeField.validation(value, this.formData)
          
          if (errors) {
            this.emitState()
            return this.$emit('onErrors', errors)
          }
        }
        return this.onNext();
      }
      this.emitState()
    },
    prev(val: boolean): void {
      if (val) return this.onPrev()
  
      this.emitState()
    },
  },
  mounted() {
    this.buildFormData(this.fields);
    this.onNext()
  },
  methods: {
    buildFormData(fields: Array<Field>): void {
      this.formData = {};
      fields.forEach((field) => (this.formData[field.id] = null));
    },
    async setActiveFieldValue(value: any) {
      let newValue = value
      if (this.activeField?.onValue) {
        const isValue = await this.activeField?.onValue(value) 
        if (!isValue) {
          this.isClear = true // undo value in active component
          newValue = null
        }
      }
      this.formData[this.activeField.id] = newValue;
    },
    onNext(): void {
      const totalFields = this.fields.length

      for(let i=this.activeIndex; i < totalFields; ++i) {
        const field = this.fields[i]

        if (!isEmpty(this.activeField) && this.activeField.id === field.id) 
          continue
        
        if (field.condition && !field.condition(this.formData)) {
          this.formData[field.id] = null
          continue
        }
        return this.setActiveField(i)
      }
      this.$emit("onFinish", this.formData);
    },
    onPrev(): void {
      for(let i=this.activeIndex; i >= 0; --i) {
        const field = this.fields[i]
        
        if (!isEmpty(this.activeField) && this.activeField.id === field.id) 
          continue
        
        if (field.condition && !field.condition(this.formData)) {
          this.formData[field.id] = null
          continue
        }

        return this.setActiveField(i)
      }
      this.emitState()
    },
    setActiveField(index: number) {
      this.activeIndex = index;
      this.activeField = this.fields[this.activeIndex];
      this.emitState()
    },
    async onValue(value: string | number | Option | Array<Option>) {
      await this.setActiveFieldValue(value);

      if ('requireNext' in this.activeField && 
          !this.activeField.requireNext) this.onNext()
    },
    emitState() {
      this.$emit("onState", {
        field: this.activeField, 
        index: this.activeIndex, 
        formData: this.formData
      });
    }
  },
});
</script>

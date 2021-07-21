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
      :activationState="state"
      :onValue="activeField.onValue"
      @onValue="onValue"
      @onClear="isClear=false"
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
      type: Object as PropType<Field[]>,
      required: true
    },
  },
  data() {
    return {
      isClear: false,
      activeIndex: 0,
      formData: {} as any,
      activeField: {} as Field,
      state: '' as 'init' | 'next' | 'prev', 
    };
  },
  watch: {
    index: {
      handler(i: number): void { 
        if (this.isIndexValid(i)) this.setActiveField(i)
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
        this.onNext();
        return 
      }
      this.emitState()
    },
    prev(val: boolean): void {
      if (val) {
        this.onPrev()
        return
      }
      this.emitState()
    },
  },
  mounted(): void {
    this.buildFormData(this.fields);
    // Validate index prop and make it the active field if set
    const i = this.index
    if (i != undefined && this.isIndexValid(i)) {
      this.setActiveField(i, 'init')
      return
    }
    this.onNext() //look for a field to mount initially
  },
  methods: {
    buildFormData(fields: Array<Field>): void {
      this.formData = {};
      fields.forEach((field) => (this.formData[field.id] = null));
    },
    isIndexValid(i: number): boolean {
      return i >= 0 && i <= this.fields.length    
    },
    async setActiveFieldValue(value: any) {
      this.formData[this.activeField.id] = value;
    },
    async onNext() {
      const totalFields = this.fields.length

      for(let i=this.activeIndex; i < totalFields; ++i) {
        const field = this.fields[i]

        if (!isEmpty(this.activeField) && this.activeField.id === field.id) 
          continue
        
        if (field.condition && !field.condition(this.formData)) {
          this.formData[field.id] = null
          continue
        }
        await this.setActiveField(i, 'next')
        return
      }
      this.$emit("onFinish", this.formData);
    },
    async onPrev() {
      for(let i=this.activeIndex; i >= 0; --i) {
        const field = this.fields[i]
        
        if (!isEmpty(this.activeField) && this.activeField.id === field.id) 
          continue
        
        if (field.condition && !field.condition(this.formData)) {
          this.formData[field.id] = null
          continue
        }

        await this.setActiveField(i, 'prev')
        return
      }
      this.emitState()
    },
    async setActiveField(index: number, state='' as 'init' | 'next' | 'prev') {
      // load callback before changing active component
      if (!isEmpty(this.activeField) && this.activeField.unload) {
        const data = this.formData[this.activeField.id]
        if (data) await this.activeField.unload(data, state)
      }
      this.state = state
      this.activeIndex = index;
      this.activeField = this.fields[this.activeIndex];
      this.emitState()

      if (this.activeField.onload) await this.activeField.onload()
    },
    onValue(value: string | number | Option | Array<Option>) {
      this.setActiveFieldValue(value);

      if ('requireNext' in this.activeField && !this.activeField.requireNext) this.onNext()
    },
    emitState() {
      this.$emit("onState", { field: this.activeField, 
        index: this.activeIndex, formData: this.formData });
    }
  },
});
</script>

<template>
  <div>
    <h1> {{activeField.helpText}} </h1>
    <keep-alive>
      <component
        :key="activeField.id"
        v-bind:is="activeField.type"
        :options="activeField.options"
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
import { Field, Option } from "./FieldType";
import SingleSelect from "@/components/FormElements/HisSelect.vue";
import MultipleSelect from "@/components/FormElements/HisMultipleSelect.vue";
import TextInput from "@/components/FormElements/HisTextInput.vue"

export default defineComponent({
  name: "BaseForm",
  components: {
    TextInput,
    SingleSelect,
    MultipleSelect,
  },
  props: {
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
    clear(val: boolean) {
      if (val) {
        this.isClear = true
        this.setValue(null, this.activeField)
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
    getValue(field: Field): any {
      return this.formData[field.id];
    },
    setValue(value: any, field: Field): void {
      this.formData[field.id] = value;
    },
    isRequireNext(field: Field): boolean {
      if (!("requireNext" in field)) return true;

      return field.requireNext ? true : false;
    },
    isCondition(field: Field): boolean {
      if (field.condition) {
        return field.condition(this.formData);
      }
      return true;
    },
    validate(value: string, field: Field): null | Array<string> {
      if (field.validation) {
        return field.validation(value, this.formData);
      }
      return null;
    },
    onNext(skipValidation = false): void {
      const totalFields = this.fields.length;
      const nextIndex = this.activeIndex + 1;

      if (!skipValidation) {
        const errors: null | Array<string> = this.validate(
          this.getValue(this.activeField), this.activeField
        );
  
        if (errors) return this.$emit("onErrors", errors);
      }

      if (nextIndex >= totalFields) return this.onFinish();

      this.setActiveField(nextIndex);

      if (!this.isCondition(this.activeField)) {
        this.setValue(null, this.activeField);
        return this.onNext(true);
      }
    },
    onPrev(): void {
      const prevIndex = this.activeIndex - 1;

      if (prevIndex <= -1) return;

      this.setActiveField(prevIndex);

      if (!this.isCondition(this.activeField)) {
        this.setValue(null, this.activeField);
        return this.onPrev();
      }
    },
    setActiveField(index: number) {
      this.activeIndex = index;
      this.activeField = this.fields[this.activeIndex];
    },
    onValue(value: string | number | Option | Array<Option>): void {
      this.setValue(value, this.activeField);

      if (!this.isRequireNext(this.activeField)) this.onNext(), this.emitNext();
    },
    emitNext() {
      this.$emit("onNext", {field: this.activeField, index: this.activeIndex});
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
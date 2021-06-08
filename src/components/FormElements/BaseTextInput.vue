<template>
  <ion-input
    v-model="text"
    :type="type"
    class="input_display"
    :disabled="disabled"
  />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { IonInput, IonGrid, IonRow, IonCol } from "@ionic/vue";
export default defineComponent({
  name: "HisInput",
  components: { IonInput },
  data:()=>({
    text: '' as string | number
  }),
  watch: {
    value(val: number | string) {
      this.text = val
    }
  },
  props: {
    value: {
      required: false,
    },
    type: {
      type: String,
      default: () => "text",
    },
    disabled: {
      type: Boolean,
      default: () => false,
    }
  },
});
</script>
<style scoped>
.input_display {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid silver;
  width: 99.5%;
  font-family: "Nimbus Sans L","Arial Narrow",sans-serif;
  font-size: 2.2em;
  background: none;
  padding-left: 5px;
}
</style>
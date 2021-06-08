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
      default: () => true,
    }
  },
});
</script>
<style scoped>
.input_display {
  border: 1px solid rgb(94, 91, 91);
  border-radius: 5px;
  width: 100%;
  font-family: Nimbus Sans L, Arial Narrow, sans-serif;
  font-size: 2.2em;
  background-color: rgb(231, 231, 231);
  color: #000;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
}
</style>
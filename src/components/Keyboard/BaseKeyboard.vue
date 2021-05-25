<template>
  <table id="keyboard">
    <tr v-for="(row, rowIndex) in layout" :key="rowIndex">
      <td v-for="(btnKey, btnIndex) in row" :key="`btn-${btnIndex}`">
        <ion-button @click="() => keyPress(btnKey)" class="keyboard-btn" full block>
          {{ btnKey }}
        </ion-button>
      </td>
      </tr>
  </table>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { IonButton } from "@ionic/vue";
export default defineComponent({
  components: { IonButton },
  props: {
    layout: {
      type: Array,
      required: true,
      default: () => []
    },
    onKeyPress: {
      type: Function,
      required: true,
    },
  },
  methods: {
    keyPress(key: any) {
      this.onKeyPress(key);
    },
  },
});
</script>
<style scoped>
table {
  width: 80%;
}
.keyboard-btn {
  width: 80%;
}
</style>

<template>
  <table id="keyboard">
    <tr v-for="(row, rowIndex) in layout" :key="rowIndex">
      <td v-for="(btnKey, btnIndex) in row" :key="`btn-${btnIndex}`">
        <div v-if="btnKey">
          <ion-button @click="() => keyPress(btnKey)" class="keyboard-btn">
            {{ btnKey }}
          </ion-button>
        </div>
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
  width: 90%;
}
td {
  padding: 2px;
}
.keyboard-btn {
  font-weight: bold;
  width: 90%;
}
@media only screen and (width: 1024px) {
  .keyboard-btn {
    height: 57px;
    font-size: 1.3rem;
  }
}
</style>
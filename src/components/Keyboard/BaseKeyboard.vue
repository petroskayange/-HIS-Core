<template>
  <ion-grid>
    <ion-row v-for="(row, rowIndex) in layout" :key="rowIndex">
      <ion-col v-for="(btnKey, btnIndex) in row" :key="`btn-${btnIndex}`">
        <ion-button @click="() => keyPress(btnKey)" expand="full" size="large">
          {{ btnKey }}
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { IonButton, IonGrid, IonCol, IonRow } from "@ionic/vue";
export default defineComponent({
  components: { IonButton, IonGrid, IonCol, IonRow },
  props: {
    layout: {
      type: Array,
      required: true,
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
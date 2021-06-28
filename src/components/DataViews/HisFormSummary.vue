<template>
  <view-port>
  <ion-list :style="{overflowX: 'auto', height: '90%'}">
    <ion-item v-for="(item, index) in fieldItems" :key="index">
      <ion-label> {{item.label}} </ion-label>
      <ion-label slot="end"> {{item.value}} </ion-label>
    </ion-item>
  </ion-list>
  </view-port>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
// import { IonLabel, IonList } from "@ionic/vue";
import { Option } from "@/components/Forms/FieldInterface"
import ViewPort from "./ViewPort.vue";
export default defineComponent({
    components: { ViewPort },
    props: {
        fieldItems: {
            type: Object as PropType<Option[]>
        }
    }
});
</script>
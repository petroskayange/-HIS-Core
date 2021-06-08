<template>
  <view-port>
  <ion-list>
    <ion-item v-for="(item, index) in fieldItems" :key="index">
      <ion-grid>
          <ion-row >
            <ion-col>
                {{item.label}}
            </ion-col>
            <ion-col>
                {{item.value}}
            </ion-col>
          </ion-row>
      </ion-grid>
    </ion-item>
  </ion-list>
  </view-port>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IonList, IonItem, IonGrid, IonRow, IonCol } from "@ionic/vue";
import { Option } from "@/components/Forms/FieldInterface"
import ViewPort from "./ViewPort.vue";
export default defineComponent({
    components: { IonList, IonItem, IonGrid, IonRow, IonCol, ViewPort },
    props: {
        fieldItems: {
            type: Object as PropType<Option[]>
        }
    }
});
</script>

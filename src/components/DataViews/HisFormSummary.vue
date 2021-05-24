<template>
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
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IonList, IonItem, IonGrid, IonRow, IonCol } from "@ionic/vue";
import { Option } from "@/components/Forms/FieldType"

export default defineComponent({
    components: { IonList, IonItem, IonGrid, IonRow, IonCol },
    props: {
        fieldItems: {
            type: Object as PropType<Option[]>
        }
    }
});
</script>

<template>
  <div>
    <ion-list>
      <ion-item v-for="(data, index) in listData" :key="index">
        <ion-grid>
          <ion-row>
            <ion-col> 
              <ion-checkbox :modelValue="data.isChecked" /> 
            </ion-col>
            <ion-col>
              <ion-label> {{ data.label }} </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-list>
  </div>
</template>
<script lang="ts">
import { Option } from "../Forms/FieldType";
import { defineComponent, PropType } from "vue";
import { IonCheckbox, IonItem, IonLabel, IonList } from "@ionic/vue";
export default defineComponent({
  components: { IonCheckbox, IonItem, IonLabel, IonList },
  name: "HisMultipleSelect",
  props: {
    items: {
      required: true,
      type: Object as PropType<Option[]>,
    },
  },
  watch: {
    listData: {
      handler(updatedItems: Array<Option>) {
        this.$emit(
          "onValue",
          updatedItems.map((item) => item.isChecked)
        );
      },
      deep: true,
    },
  },
  data() {
    return {
      listData: [] as Array<Option>,
    };
  },
  mounted() {
    this.listData = [...this.items];
  },
});
</script>
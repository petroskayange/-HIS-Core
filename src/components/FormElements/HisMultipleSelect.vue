<template>
    <ion-list>
      <ion-item v-for="(entry, index) in listData" :key="index">
        <ion-label> {{ entry.label }} </ion-label>
        <ion-checkbox v-model="entry.isChecked" slot="end"/>
    </ion-item>
  </ion-list>
</template>
<script lang="ts">
import { Option } from "../Forms/FieldType";
import { defineComponent, PropType } from "vue";
import { IonCheckbox, IonItem, IonLabel, IonList } from "@ionic/vue";
export default defineComponent({
  components: { IonCheckbox, IonItem, IonLabel, IonList },
  name: "HisMultipleSelect",
  props: {
    options: {
      required: true,
      type: Object as PropType<Option[]>,
    },
  },
  data() {
    return {
      listData: [] as Array<Option>,
    };
  },
  watch: {
    listData: {
      handler(updatedItems: Array<Option>) {
        const values = updatedItems.filter((item) => item.isChecked);
        if (values.length >= 1) this.$emit("onValue", values);
      },
      deep: true,
    },
  },
  mounted() {
    this.listData = this.options.map((item) => {
      item.isChecked = false;
      return item;
    });
  },
});
</script>

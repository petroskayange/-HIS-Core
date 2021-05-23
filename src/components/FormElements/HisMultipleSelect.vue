<template>
    <div>
      <his-text-input :value="selected" /> 
      <ion-list>
        <ion-item v-for="(entry, index) in listData" :key="index">
          <ion-label> {{ entry.label }} </ion-label>
          <ion-checkbox v-model="entry.isChecked" slot="end"/>
      </ion-item>
      </ion-list>
    </div>
</template>
<script lang="ts">
import HisTextInput from "@/components/FormElements/HisTextInput.vue"
import { Option } from "../Forms/FieldType";
import { defineComponent, PropType } from "vue";
import { IonCheckbox, IonItem, IonLabel, IonList } from "@ionic/vue";
export default defineComponent({
  components: { IonCheckbox, IonItem, IonLabel, IonList, HisTextInput },
  name: "HisMultipleSelect",
  props: {
    clear: {
      type: Boolean
    },
    options: {
      required: true,
      type: Object as PropType<Option[]>,
    },
  },
  data: () => ({
    selected: '',
    listData: [] as Array<Option>,
  }),
  methods: {
    setListData(){
      this.listData = this.options.map((item) => {
        item.isChecked = false;
        return item;
      });
    }
  },
  watch: {
    clear(val: boolean){
      if (val) {
        this.selected = ''
        this.setListData()
        this.$emit('onClear')
      }
    },
    listData: {
      handler(updatedItems: Array<Option>) {
        const values = updatedItems.filter((item) => item.isChecked);
        this.selected = values.map(item => item.label).join(';')
        if (values.length >= 1)  this.$emit("onValue", values);
      },
      deep: true,
    },
  },
  mounted() {
    this.setListData()
  },
});
</script>

<template>
    <div>
      <his-text-input :value="selected" :disabled="false" /> 
      <ion-list>
        <ion-item v-for="(entry, index) in filtered" :key="index">
          <ion-label> {{ entry.label }} </ion-label>
          <ion-checkbox v-model="entry.isChecked" slot="end"/>
      </ion-item>
      </ion-list>
      <his-keyboard :onKeyPress="keypress"/>
    </div>
</template>
<script lang="ts">
import { Option } from "../Forms/FieldType";
import { defineComponent } from "vue";
import { IonCheckbox } from "@ionic/vue";
import SelectMixin from "@/components/FormElements/SelectMixin.vue"

export default defineComponent({
  components: { IonCheckbox },
  name: "HisMultipleSelect",
  mixins: [SelectMixin],
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
        this.setListData()
        this.clearSelection()
      }
    },
    listData: {
      handler(updatedItems: Array<Option>) {
        const values = updatedItems.filter((item) => item.isChecked);
        this.selected = values.map(item => item.label).join(';')
        this.filter = ''

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
<template>
    <div>
      <view-port :showFull="!showKeyboard">
      <his-text-input :value="selected" :disabled="false"/> 
      <ion-list>
        <ion-item v-for="(entry, index) in filtered" :key="index" color="light">
          <ion-label> {{ entry.label }} </ion-label>
          <ion-checkbox v-model="entry.isChecked" slot="end"/>
      </ion-item>
      </ion-list>
      </view-port>
      <his-keyboard v-if="showKeyboard" :kbConfig="keyboard" :onKeyPress="keypress"/>
    </div>
</template>
<script lang="ts">
import { Option } from "../Forms/FieldInterface";
import { defineComponent } from "vue";
import { IonCheckbox } from "@ionic/vue";
import SelectMixin from "@/components/FormElements/SelectMixin.vue"

export default defineComponent({
  components: { IonCheckbox },
  name: "HisMultipleSelect",
  mixins: [SelectMixin],
  methods: {
    setState(dataItem: Option, isChecked=false) {
      dataItem.isChecked = isChecked
      return dataItem
    },
  },
  watch: {
    clear(val: boolean){
      if (val) {
        this.clearSelection()
        this.listData = this.listData.map((item)=>this.setState(item))
      }
    },
    listData: {
      handler(updatedItems: Array<Option>) {
        this.filter = ''
        const values = updatedItems.filter((item) => item.isChecked);
        this.selected = values.map(item => item.label).join(';')

        if (values.length >= 1) this.$emit("onValue", values);
      },
      deep: true,
    },
  },
  async activated() {
    const options = await this.options(this.fdata)
    this.listData = options.map((item: Option)=>this.setState(item))
  },
});
</script>
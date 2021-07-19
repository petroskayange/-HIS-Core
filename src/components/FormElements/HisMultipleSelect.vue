<template>
    <div>
      <view-port :showFull="!showKeyboard">
      <his-text-input  v-if="showKeyboard" :value="selected" @onValue="(value) => onKbValue(value, showKeyboard)" :disabled="false"/>
      <span v-for="(item, index) in checkedItems" :key="index"> 
        <ion-chip color="danger" @click="uncheck(item.label)">{{item.label}}</ion-chip>
      </span>
      <ion-list class='view-port-content'>
        <ion-item v-for="(entry, index) in filtered" :key="index" :color="entry.isChecked ? 'light':''">
          <ion-label> 
            {{ entry.label }} 
            <span v-if="entry.other?.disableReason">({{entry.other?.disableReason}})</span>
          </ion-label>
          <ion-checkbox v-model="entry.isChecked" slot="end" :disabled="entry.other?.disabled"/>
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
import { find } from "lodash"
import SelectMixin from "@/components/FormElements/SelectMixin.vue"
export default defineComponent({
  components: { IonCheckbox },
  name: "HisMultipleSelect",
  mixins: [SelectMixin],
  methods: {
    /*
      * Update existing list with new options while maintaining previously selected items
    */
    updateListData(newListData: Array<Option>) {
      this.listData = newListData.map(item => {
        const itemChecked = find(this.listData, { 
          label: item.label, 
          value: item.value, 
          isChecked: true 
        })

        if (itemChecked) return itemChecked

        if (!('isChecked' in item)) {
          item.isChecked = false
        }
        return item
      })
    },
    uncheck(label: string) {
      this.listData.forEach(option => {
        if (option.label === label) option.isChecked = false
      }) 
    },
    getChecked(list: Array<Option>) {
      return list.filter((item: Option) => item.isChecked)
    }
  },
  computed: {
    checkedItems(): Array<Option> {
      return this.getChecked(this.listData)
    }
  },
  watch: {
    clear(isClear: boolean){
      if (isClear) {
        // uncheck items
        this.listData = this.listData.map((item) => {
          item.isChecked = false
          return item
        })
        this.$emit('onClear')
      }
    },
    listData: {
      handler(updatedItems: Array<Option>) {
        // clear search string entered via keyboard
        this.filter = ''
  
        const values = this.getChecked(updatedItems);

        this.$emit("onValue", values);
      },
      deep: true
    }
  },
  async activated() {
    const data = await this.options(this.fdata)
    this.updateListData(data)
  }
});
</script>
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
import HisTextInput from "@/components/FormElements/HisTextInput.vue"
import HisKeyboard from "@/components/Keyboard/HisKeyboard.vue"
import handleVirtualInput from "@/components/Keyboard/KbHandler"
import { Option } from "../Forms/FieldType";
import { defineComponent, PropType } from "vue";
import { IonCheckbox, IonItem, IonLabel, IonList } from "@ionic/vue";

export default defineComponent({
  components: { IonCheckbox, IonItem, IonLabel, IonList, HisTextInput, HisKeyboard  },
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
    filter: '',
    selected: '',
    listData: [] as Array<Option>,
  }),
  computed: {
    filtered(): Array<Option> {
      if (this.filter) {
        return this.listData.filter(item => item.label.match(new RegExp(this.filter, 'i')))
      }
      return this.listData
    }
  },
  methods: {
    keypress(text: any) {
      this.filter = handleVirtualInput(text, this.selected)
      this.selected = this.filter
    },
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
        this.filter = ''
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
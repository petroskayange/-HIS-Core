<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>
        <center>
          <h4>  {{ title }} </h4>
          <b v-if="subtitle"> {{ subtitle }} </b>
        </center>
      </ion-title>
    </ion-toolbar>
  </ion-header>
    <ion-content>
      <div class="clear-fix"> </div>
      <component 
        @onSelect="onSelect" 
        v-bind:is="sheetType"
        :title="sheetTitle"
        :description="sheetDescription"
        :items="items"> 
      </component>
    </ion-content>
  <dynamic-nav color="light" :btns="btns"> </dynamic-nav>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Option } from "@/components/Forms/FieldInterface"
import DynamicNav from "@/components/HisDynamicNavFooter.vue"
import ButtonSheet from "@/components/DataViews/actionsheet/ButtonSheet.vue"
import InfoSheet from "@/components/DataViews/actionsheet/InfoSheet.vue"
import { NavBtnInterface } from "@/components/HisDynamicNavFooterInterface";
import { modalController } from '@ionic/vue';
import { isEmpty } from "lodash"

export default defineComponent({
  components: { DynamicNav, ButtonSheet, InfoSheet },
  data: () => ({
    selected: {} as Option
  }),
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    sheetTitle: {
      type: String
    },
    sheetDescription: {
      type: String
    },
    items: {
      type: Object as PropType<Option[]>,
      default: ()=> []
    },
    sheetType: {
      type: String,
      required: true
    },
    actionButtons: {
      type: Object as PropType<NavBtnInterface[]>,
      default: () => ([
        {
          name: 'Cancel',
          color: 'secondary',
          slot: 'start'
        },
        {
          name: 'Continue',
          slot: 'end'
        },
      ])
    }
  },
  computed: {
    btns(): Array<NavBtnInterface> {
      return this.actionButtons.map((btn: NavBtnInterface) => {
          btn.size = 'large'
          btn.color = btn.color || 'primary'
          btn.visible = true
          btn.onClick = () => {
            let selection = ''
            if (!isEmpty(this.selected)) {
              selection = this.selected.label
            }
            return modalController.dismiss({ selection, action: btn.name })
          }
          return btn
      })
    }
  },
  methods: {
    onSelect(item: Option) {
      this.selected = item
    }
  }
});
</script>
<style scoped>
  .clear-fix {
    margin: 2%;
  }
</style>

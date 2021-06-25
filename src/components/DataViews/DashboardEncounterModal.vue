<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-row>
      <ion-col size="4">
        <ion-list>
          <ion-item
            v-for="(item, index) in items"
            :key="index"
            :color="item.other.id === active.id ? 'light' : ''"
            :detail="true"
            @click="() => showDetails(item.other)"
          >
            {{ item.label }}
          </ion-item>
        </ion-list>
      </ion-col>
      <ion-col size="8">
        <div class='tb'>
        <his-basic-table :columns="active.columns" :rows="active.rows"/>
        </div>
      </ion-col>
    </ion-row>
  </ion-content>
  <ion-footer>
    <ion-toolbar> 
      <ion-button color="danger" @click="voidActiveItem" :disabled="!canVoid" slot="end"> Void </ion-button>
      <ion-button @click="closeModal" slot="end"> Close </ion-button>
    </ion-toolbar>
  </ion-footer>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import HisBasicTable from "@/components/DataViews/HisBasicTable.vue";
import { actionSheetController, modalController } from "@ionic/vue"
import { Option } from "@/components/Forms/FieldInterface"
import {isEmpty} from "lodash"
export default defineComponent({
  components: { HisBasicTable },
  data: () => ({
    active: {
      id: -1,
      rows: [],
      columns: []
    } as any,
  }),
  computed: {
    canVoid(): boolean {
      return !isEmpty(this.active)
    }
  },
  watch: {
    items: {
      handler(items: any){
        if (items.length >= 1) {
          this.showDetails(items[0].other)
        } 
      },
      immediate: true,
      deep: true
    }
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Object as PropType<Option[]>,
      required: true,
    },
  },
  methods: {
    async closeModal() {
      await modalController.dismiss({})
    },
    async initiateVoidReason() {
      const actionSheet = await actionSheetController.create({
        header: 'Are you sure you want to void this Encounter?',
        subHeader: 'Please specify reason for voiding this encounter',
        mode: 'ios',
        buttons: [
          {
            text: 'Mistake/ Wrong Entry',
            role: 'Mistake/ Wrong Entry'
          },
          {
            text: 'Duplicate',
            role: 'Duplicate'
          },
          {
            text: 'System Error',
            role: 'System Error'
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ]
      })
      actionSheet.present()
      const { role } = await actionSheet.onDidDismiss();
      return role
    },
    async voidActiveItem() {
      const reason = await this.initiateVoidReason()

      if (reason === 'cancel') return

      await this.active.onVoid(reason)

      this.active = {}
      
      if (this.items.length >= 1) {
        this.showDetails(this.items[0].other)
      } 
    },
    async showDetails({id, columns, getRows, onVoid}: any) {
      this.active.id = id
      this.active.columns = columns;
      this.active.onVoid = onVoid
      this.active.rows = await getRows()
    },
  },
});
</script>
<style scoped>
  .tb {
    height: 480px;
    overflow-y: auto;
  }
</style>
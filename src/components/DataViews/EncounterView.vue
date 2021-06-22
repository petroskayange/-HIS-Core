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
            @click="() => showDetails(item.other)"
            detail
          >
            {{ item.label }}
          </ion-item>
        </ion-list>
      </ion-col>
      <ion-col size="8">
        <his-basic-table :columns="active.columns" :rows="active.rows"/>
      </ion-col>
    </ion-row>
  </ion-content>
  <ion-footer> 
    <ion-toolbar> 
      <ion-button color="danger" @click="voidActiveItem" :disabled="!canVoid" slot="end"> Void </ion-button>
    </ion-toolbar>
  </ion-footer>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import HisBasicTable from "@/components/DataViews/HisBasicTable.vue";
import {actionSheetController} from "@ionic/vue"
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
      return this.active.id != -1
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
      type: Array,
      required: true,
    },
  },
  methods: {
    async voidActiveItem() {
      const actionSheet = await actionSheetController
        .create({
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
      await this.active.onVoid(role)
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
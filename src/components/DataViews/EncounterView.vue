<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-row>
      <ion-col size="6">
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
      <ion-col size="6">
        <his-basic-table :columns="active.columns" :rows="active.rows"/>
      </ion-col>
    </ion-row>
  </ion-content>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import HisBasicTable from "@/components/DataViews/HisBasicTable.vue";

export default defineComponent({
  components: { HisBasicTable },
  data: () => ({
    active: {
      id: 0,
      rows: [],
      columns: []
    } as any,
  }),
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
    async showDetails({id, columns, getRows}: any) {
      this.active.id = id
      this.active.columns = columns;
      this.active.rows = await getRows()
    },
  },
});
</script>
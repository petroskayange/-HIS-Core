<template>
    <ion-header> 
        <ion-toolbar> 
            <ion-title> {{ title }} </ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content> 
        <his-basic-table :columns="columns" :rows="rows"> </his-basic-table> 
    </ion-content>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import HisBasicTable from './HisBasicTable.vue'

export default defineComponent({
  components: { HisBasicTable },
  props: {
      title: {
        type: String, 
        required: true
      },
      columns: {
        type: Object as PropType<string[]>,
        required: true
      },
      rows: {
        type: Object as PropType<string[]>,
        default: true
      }
  }
})
</script>

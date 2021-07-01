<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{title}}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-grid class="selector">
    <ion-row v-for="(row, rowIndex) in turpleTaskItems" :key="rowIndex">
      <ion-col size="4" v-for="(taskItem, taskIndex) in row" :key="`task-${taskIndex}`">
        <task-card
          @click="doTask(taskItem)"
          :title="taskItem.name"
          :description="taskItem.description"
          :icon="taskItem.icon">
        </task-card>
      </ion-col>
    </ion-row>
  </ion-grid>
  <ion-footer>
    <ion-toolbar> 
      <ion-button @click="closeModal" slot="end"> Close </ion-button>
    </ion-toolbar>
  </ion-footer>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import TaskCard from "@/components/DataViews/TaskCard.vue";
import { IonGrid, IonRow, IonCol, modalController } from "@ionic/vue"; 
import { TaskInterface } from "@/apps/interfaces/TaskInterface";
import Transformer from "@/utils/Transformers"
export default defineComponent({
  components: { IonGrid, IonRow, IonCol, TaskCard },
  props: {
    title: {
      type: String,
      default: 'Select Activity'
    },
    items: {
      type: Object as PropType<TaskInterface[]>,
      required: true,
    },
    itemsPerRow: {
      type: Number,
      default: 3
    },
    taskParams: {
      type: Object,
      required: false
    }
  },
  methods: {
    async closeModal() {
      await modalController.dismiss({})
    },
    doTask(taskItem: TaskInterface) {
      if (taskItem.action) return taskItem.action(this.taskParams)
      
      const params = { p: JSON.stringify(this.taskParams)}

      this.$router.push({ name: taskItem.name, params })
      this.closeModal()
    }
  },
  computed: {
    turpleTaskItems(): any {
      return Transformer.convertArrayToTurples(this.items, this.itemsPerRow)
    }
  }
});
</script>
<style scoped>
  .selector{
    width: 100%;
    height: 90%;
    overflow-y: auto;
  }
</style>
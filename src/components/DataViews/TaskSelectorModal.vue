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
      type: Object as PropType<any>,
      required: false
    }
  },
  methods: {
    async closeModal() {
      await modalController.dismiss({})
    },
    doTask(taskItem: TaskInterface) {
      if (taskItem.action) {
        taskItem.action(this.taskParams)
      }

      if (taskItem.url) {
        this.$router.push({ path: taskItem.url })
      }
      this.closeModal()
    }
  },
  computed: {
    turpleTaskItems() {
        const turples: any = [[]]
        let rowIndex = 0
        let counter = 0
        this.items.forEach((item: any) => {
            if (counter >= this.itemsPerRow) {
                turples.push([])
                counter = 0
                ++rowIndex
            }
            turples[rowIndex].push(item)
            ++counter
        })
        return turples
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
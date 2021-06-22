<template>
  <div>
    <div v-show="activeReports.length == 0">
      <ion-grid>
        <ion-row>
          <ion-col
            size="6"
            v-for="(report, index) in Object.keys(reports).sort()"
            :key="index"
          >
            <task-card
        @click="showReports(report)"
              :key="index"
              :title="report"
              :description="report"
              :icon="'/assets/images/sys-setting.png'"
            >
            </task-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
    <div v-if="activeReports.length > 0">
      <ion-button @click="activeReports = []" color="danger">back</ion-button>
      <br />
      <ion-grid>
        <ion-row>
          <ion-col
            size="6"
            v-for="(innerreport, idx) in activeReports"
        :key="idx"
          >
            <task-card
              :key="index"
              :title="innerreport.name"
              :description="innerreport.name"
              :icon="'/assets/images/sys-setting.png'"
            >
            </task-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { IonButton } from "@ionic/vue";
import TaskCard from "@/components/DataViews/TaskCard.vue";
export default defineComponent({
  components: {
    IonButton,
    "task-card": TaskCard,
  },
  data() {
    return {
      reports: {
        'Drug Management': [
          {
            name: "Enter Receipts",
            route: "/",
          },
          {
            name: "Enter Product relocation/Disposal",
            route: "/",
          },
          {
            name: "Enter verified physical stock count",
            route: "/",
          },
          {
            name: "Print Barcode",
            route: "/",
          },
          {
            name: "Audit Trail",
            route: "/",
          },
        ],
        'User Management': [
          {
            name: "Cohort / disaggregated",
            route: "/",
          },
          {
            name: "Survival analysis",
            route: "/",
          },
          {
            name: "TPT new initiations",
            route: "/",
          },
        ],
        'System Preferences': [
          {
            name: "Cohort / disaggregated",
            route: "/",
          },
          {
            name: "Survival analysis",
            route: "/",
          },
          {
            name: "TPT new initiations",
            route: "/",
          },
        ],
        'Data Management': [
          {
            name: "Cohort / disaggregated",
            route: "/",
          },
          {
            name: "Survival analysis",
            route: "/",
          },
          {
            name: "TPT new initiations",
            route: "/",
          },
        ],
      },
      activeReports: [],
    };
  },
  methods: {
    showReports(report) {
      this.activeReports = [...this.reports[report]];
    },
  },
  mounted() {
    //
  },
});
</script>

<style>

</style>
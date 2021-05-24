<template>
  <div>
    <div v-show="activeReports.length == 0">
      <ion-button
        v-for="(report, index) in Object.keys(reports)"
        :key="index"
        @click="showReports(report)"
        size="large"
        color="medium"
      >
        {{ report }}
      </ion-button>
    </div>
    <div v-if="activeReports.length > 0">
      <ion-button @click="activeReports = []" color="danger">back</ion-button>
      <br />
      <ion-button
        v-for="(innerreport, idx) in activeReports"
        :key="idx"
        size="default"
        color="medium"
      >
        {{ innerreport.name }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { IonButton } from "@ionic/vue";
export default defineComponent({
  components: {
    IonButton,
  },
  data() {
    return {
      reports: {
        clinic: [
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
        MoH: [
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
        PEPFAR: [
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
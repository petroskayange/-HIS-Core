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
              @click="goTo(innerreport)"
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
import { IonButton, IonGrid, IonRow, IonCol } from "@ionic/vue";
import TaskCard from "@/components/DataViews/TaskCard.vue";
export default defineComponent({
  components: {
    IonButton,
    IonGrid,
    IonRow, 
    IonCol,
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
            name: "Ask pills remaining at home",
            value: "ask_pills_remaining_at_home"
          },
          {
            name: "Activate Filing Numbers",
            value: "use_filing_numbers"
          },
          {
            name: "Activate extended labs",
            value: "extended_labs"
          },
          {
            name: "Activate drug management",
            value: "activate_drug_management"
          },
          {
            name: "Activate Hypertension screening",
            value: "aactivate.htn.enhancement"
          },
          {
            name: "Activate fast track",
            value: "ask_pills_remaining_at_home"
          },
          {
            name: "Is this a military site",
            value: "military_site"
          },
          {
            name: "Activate 3HP auto select",
            value: "activate_3hp_auto_select"
          }
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
      this.activeReports = [...this.reports[report] ];
    },
    goTo(report) {
      if(report.value) {
      this.$router.push({path: '/preferences', query: {
        label: report.name,
        property: report.value
      }})
      }
    }
  },
});
</script>

<style>

</style>
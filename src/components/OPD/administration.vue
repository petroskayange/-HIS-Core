<template>
  <div>
    <div v-show="activepreferences.length == 0">
      <ion-grid>
        <ion-row>
          <ion-col
            size="6"
            v-for="(preference, index) in Object.keys(preferences).sort()"
            :key="index"
          >
            <task-card
              @click="showpreferences(preference)"
              :key="index"
              :title="preference"
              :description="preference"
              :icon="'/assets/images/sys-setting.png'"
            >
            </task-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
    <div v-if="activepreferences.length > 0">
      <ion-button @click="activepreferences = []" color="danger">back</ion-button>
      <br />
      <ion-grid>
        <ion-row>
          <ion-col
            size="4"
            v-for="(innerpreference, idx) in activepreferences"
            :key="idx"
          >
            <task-card
              :key="index"
              :title="innerpreference.name"
              :description="innerpreference.name"
              @click="goTo(innerpreference)"
              :icon="'/assets/images/sys-setting.png'"
            >
            </task-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonButton, IonGrid, IonRow, IonCol } from "@ionic/vue";
import { AppInterface } from "@/apps/interfaces/AppInterface";
import TaskCard from "@/components/DataViews/TaskCard.vue";
import Settings from "@/components/ART/Settings.vue";
import { ProgramService } from "@/services/program_service";
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
      preferences: {} as any,
      app: {} as AppInterface | {},
      activepreferences: [] as any,
    };
  },
  methods: {
    showpreferences(preference: any) {
      this.activepreferences = [...this.preferences[preference]];
    },
    goTo(preference: any) {
      if (preference.value) {
        this.$router.push({
          path: "/preferences",
          query: {
            label: preference.name,
            property: preference.value,
          },
        });
      } else {
        this.$router.push(`/settings?name=${preference.component}`);
      }
    },
    async init() {
      this.app = ProgramService.getActiveApp();
      if ("preferences" in this.app) {
        this.preferences = this.app.preferences;
      }
    },
  },
  watch: {
    $route: {
      async handler({ query }: any) {
        this.init();
      },
      deep: true,
      immediate: true,
    },
  },
});
</script>

<style>
</style>
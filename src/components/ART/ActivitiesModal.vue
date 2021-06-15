<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Select activities</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list style="height: 90%; overflow: scroll">
      <ion-item v-for="(entry, index) in activities" :key="index" color="light">
        <ion-label> {{ entry.value }} </ion-label>
        <ion-checkbox v-model="entry.selected" slot="start" />
      </ion-item>
    </ion-list>
    <ion-row> </ion-row>
    <ion-button @click="postActivities" :disabled="selectedActivities.length == 0">finish</ion-button>
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonButton,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonRow,
  modalController,
  IonList,
  IonItem,
  IonCheckbox,
} from "@ionic/vue";
import { defineComponent } from "vue";
import ApiClient from "@/services/api_client";
export default defineComponent({
  name: "Modal",
  props: {
    title: { type: String, default: "" },
  },
  methods: {
    async getActivities() {
      //
      const response = await ApiClient.get(
        `/user_properties?property=activities`
      );

      if (!response || response.status !== 200) {
        //
        ApiClient.showMessage("Could not get user activities");
      } 
      else {
        //
        const data: any = await response.json();
        this.activities = this.activities.map((el) => {
          if (data.property_value.search(el.value) >= 0) {
            el.selected = true;
          }
          return el;
        });
      }
    },
    async postActivities() {
      const userActivities = {
        property: "activities",
        'property_value': this.selectedActivities,
      };
      const response = await ApiClient.post(`/user_properties`, userActivities);

      if (!response || response.status !== 201) {
        ApiClient.showMessage("Could not save activities");
        //
      } else {
        await modalController.dismiss();
      }
    },
  },
  computed: {
    selectedActivities(): string {
      return this.activities
        .filter((element) => element.selected == true)
        .map((el) => {
          return el.value;
        })
        .join(",");
    }
  },
  mounted() {
    this.getActivities();
  },
  data() {
    return {
      content: "Content",
      activities: [
        { value: "ART adherence", selected: false },
        { value: "HIV clinic consultations", selected: false },
        { value: "HIV first visits", selected: false },
        { value: "HIV reception visits", selected: false },
        { value: "HIV staging visits", selected: false },
        { value: "Manage Appointments", selected: false },
        { value: "Drug Dispensations", selected: false },
        { value: "Prescriptions", selected: false },
        { value: "Vitals", selected: false },
      ],
    };
  },
  components: {
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonRow,
    IonLabel,
    IonList,
    IonItem,
    IonCheckbox,
  },
});
</script>
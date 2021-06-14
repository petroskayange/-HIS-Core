<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Select activities</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list style="height: 90%; overflow: scroll;">
      <ion-item v-for="(entry, index) in activities" :key="index" color="light">
        <ion-label> {{ entry.value }} </ion-label>
        <ion-checkbox v-model="entry.selected" slot="start" />
      </ion-item>
    </ion-list>
    <ion-row> </ion-row>
    <ion-button @click="postActivities" >finish</ion-button>
  </ion-content>
  
</template>

<script lang="ts">
import { IonContent, IonButton, IonHeader, IonTitle, IonToolbar, IonLabel, IonRow, modalController, IonList, IonItem, IonCheckbox } from '@ionic/vue';
import { defineComponent } from 'vue';
import ApiClient from "@/services/api_client";
export default defineComponent({
  name: 'Modal',
  props: {
    title: { type: String, default: '' },
  },
  methods: {
    async getActivities() {
       // 
     const response = await ApiClient.get(`/user_properties?property=activities`);

      if (!response || response.status !== 200) {
        //
      } // NOTE: Targeting Firefox 65, can't `response?.status`
      else {
      //
        const data: any = await response.json();
        this.activities = this.activities.map(el => {

          if(data.property_value.search(el.value) >= 0) {
            el.selected = true;
          } 
          return el;
        })
        // let activities = data.property_value.split();
      }
    },
    async postActivities() {
      const selectedActivities = this.activities.filter(element => element.selected == true)
      .map(el => {
        return el.value;
      }).join(',');
      console.log(selectedActivities);
      await modalController.dismiss();
    },
  },
  mounted() {
    // this.getApps();
    this.getActivities();
  },
  data() {
    return {
      content: 'Content',
      activities: [
      {value: "ART adherence", selected: false},
      {value: "HIV clinic consultations", selected: false},
      {value: "HIV first visits", selected: false},
      {value: "HIV reception visits", selected: false},
      {value: "HIV staging visits", selected: false},
      {value: "Manage Appointments", selected: false},
      {value: "Drug Dispensations", selected: false},
      {value: "Prescriptions", selected: false},
      {value: "Vitals", selected: false},
      ]
    }
  },
  components: {IonButton, IonContent, IonHeader, IonTitle, IonToolbar,  IonRow, IonLabel, IonList, IonItem, IonCheckbox}
});
</script>
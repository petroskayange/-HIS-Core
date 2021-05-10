<template>
<ion-grid>
  <ion-row>
    <ion-col>
      <p>Complete / incomplete visits: last 5 days</p>
    <apexchart width="100%" type="bar" :options="options" :series="series"></apexchart>
    </ion-col>
    <ion-col>

  <!-- List Headers in Lists -->
  <ion-list>
    <ion-list-header lines="inset">
      <ion-button>  </ion-button>
      <ion-button>Male</ion-button>
      <ion-button>FeMale</ion-button>
      <ion-button>Me</ion-button>
      <ion-button>Facility</ion-button>
    </ion-list-header>
    <ion-item lines="none">
      <ion-label color="primary">
        <h2>1</h2>
      </ion-label>
    </ion-item>
  </ion-list>


    </ion-col>
  </ion-row>
</ion-grid>

</template>

<script lang="ts">
import { IonGrid, IonRow, IonCol, IonList, IonButton, IonItem, IonListHeader, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import ApiClient from "@/services/api_client"
import moment from 'moment'

export default defineComponent({
    data: function() {
    return {
      options: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      },
      series: [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }],
      encounters: [
          'HIV clinic registration',
          'HIV reception','Vitals',
          'HIV staging','HIV clinic consultation',
          'ART adherence','Treatment',
          'Dispensing','Appointments'
        ]
    }
  },
  components: {
    IonGrid,
    IonRow,
    IonCol, IonList, IonButton, IonItem, IonListHeader, IonLabel
  },
  methods: {
        getVisits: async function() {

        const response = await ApiClient.get("/api/v1/programs/1/reports/visits?name=visits&start_date=' + start_date + '&end_date=' + end_date;");

        if (!response || response.status !== 200) return; // NOTE: Targeting Firefox 65, can't `response?.status`

        // const data = await response.json();
        // sessionStorage.sessionDate = data.date;
        // this.fetchLocationName(data.current_health_center_id);
      },
  },
  created: function(){
      // console.log(moment());
  }
});
</script>

<style>
</style>
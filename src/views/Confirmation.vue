<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-row>
          <ion-col >
            <p>Patient Name: {{ patientName }}</p>
            <p>Birthdate: {{ userLocation }}</p>
            <p>Ancestry district: {{ sessionDate }}</p>
            <p>Ancestry TA: {{ sessionDate }}</p>
            <p>Ancestry village: {{ sessionDate }}</p>
            <p>Current District : {{ userName }}</p>
            <p>Current TA : {{ userName }}</p>
            <p>Current Village : {{ userName }}</p>
          </ion-col>
        </ion-row>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
        <ion-card>
          <ion-card-content>
            
          </ion-card-content>
        </ion-card>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-row>
          <ion-col>
            <ion-button color="danger left" size="large" router-link="/"
              >Cancel</ion-button
            >
            
          </ion-col>
        <ion-col>
<ion-button color="danger left" size="large" router-link="/"
              >Void</ion-button
            >
          </ion-col> 
          <ion-col>
            <ion-button color="success" size="large" @click="openModal"
              >Continue</ion-button
            >
          </ion-col>
        </ion-row>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonFooter,
  IonPage,
  IonToolbar,
  IonRow,
  IonCol,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { barcode } from "ionicons/icons";
import ApiClient from "@/services/api_client";
export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonRow,
    IonCol,
    IonButton,
    IonFooter,
    IonCard,
    IonCardContent,
    // IonImg,
    // IonThumbnail
  },
  data() {
    return {
      facilityName: "",
      userLocation: "",
      sessionDate: "",
      userName: "",
      APIVersion: "",
      applicationName: "",
      activeTab: 1,
      ready: false,
      patientBarcode: "",
      applicationIcon: null,
    };
  },
  methods: {
    fetchLocationID: async function () {
      const response = await ApiClient.get(
        "global_properties?property=current_health_center_id"
      );

      if (!response || response.status !== 200) return; // NOTE: Targeting Firefox 65, can't `response?.status`

      const data = await response.json();
      this.fetchLocationName(data.current_health_center_id);
    },
    fetchLocationUUID: async function () {
      const response = await ApiClient.get(
        "global_properties?property=site_uuid"
      );

      if (!response || response.status !== 200) return; // NOTE: Targeting Firefox 65, can't `response?.status`

      const data = await response.json();
      sessionStorage.siteUUID = data.site_uuid;
    },
    fetchSessionDate: async function () {
      const response = await ApiClient.get("current_time");

      if (!response || response.status !== 200) return; // NOTE: Targeting Firefox 65, can't `response?.status`

      const data = await response.json();
      this.sessionDate = data.date;
      sessionStorage.sessionDate = data.date;
      // this.fetchLocationName(data.current_health_center_id);
    },
    async fetchAPIVersion() {
      const response = await ApiClient.get("version");

      if (!response || response.status !== 200) return;

      const data = await response.json();

      this.APIVersion = data["System version"];
      sessionStorage.APIVersion = data["System version"];
    },
    async fetchLocationName(locationID: string) {
      const response = await ApiClient.get("locations/" + locationID);

      if (!response || response.status !== 200) return;

      const data = await response.json();
      this.facilityName = data.name;
      // this.createSessionLocationName(data);
    },
    
    loadApplicationData() {
      this.ready = true;
      this.userLocation = sessionStorage.userLocation;
      this.userName = sessionStorage.username;
      this.fetchLocationID();
      this.fetchSessionDate();
    },
    
  },
  setup() {
    return {
      barcode,
    };
  },
  mounted() {
   // load stuff here 
  },
});
</script>

<style scoped>
ion-col p {
  margin: 0;
}
ion-button {
  width: 100%;
}

.outlined {
  border: solid 1px grey;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
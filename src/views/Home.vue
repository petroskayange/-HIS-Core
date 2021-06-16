<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-row>
          <ion-col size="0.5">
            <ion-icon
              :icon="barcode"
              size="large"
              style="height: 100%"
            ></ion-icon>
          </ion-col>
          <ion-col size="3.5" >
            <ion-input autofocus v-model="patientBarcode" class="barcode-input" ref="scanBarcode"></ion-input>
          </ion-col>
          <ion-col size="5">
            <p>Facility name: {{ facilityName }}</p>
            <p>Location: {{ userLocation }}</p>
            <p>Date: {{ sessionDate }}</p>
            <p>User: {{ userName }}</p>
          </ion-col>
          <ion-col size="3">
            <ion-row>
              <ion-col>
                <p>
                  {{ applicationName }}
                </p>
              </ion-col>
              <ion-col>
                <ion-thumbnail v-if="applicationIcon">
                  <ion-img :src="applicationIcon"></ion-img>
                </ion-thumbnail>
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container" v-if="ready">
        <ion-segment scrollable value="1" class="ion-justify-content-center">
          <ion-segment-button value="1" @click="activeTab = 1">
            <ion-label>Overview</ion-label>
          </ion-segment-button>
          <ion-segment-button value="2" @click="activeTab = 2">
            <ion-label>Reports</ion-label>
          </ion-segment-button>
          <ion-segment-button value="3" @click="activeTab = 3">
            <ion-label>Administration</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-card>
          <ion-card-content>
            <overview v-show="activeTab == 1"> </overview>
            <reports v-show="activeTab == 2"></reports>
            <administration v-show="activeTab == 3"></administration>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-row>
          <ion-col>
            <ion-button color="danger left" size="large" router-link="/login"
              >Logout</ion-button
            >
          </ion-col>
          <ion-col>
            <ion-button color="primary" size="large" router-link="/patients/search/by_arv">Find By</ion-button>
          </ion-col>
          <ion-col>
            <ion-button color="primary" size="large" router-link="/search_patient"
              >Find or Register</ion-button
            >
          </ion-col>
          <ion-col>
            <ion-button color="primary" size="large" @click="openModal"
              >Applications</ion-button
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
  modalController,
  IonFooter,
  IonPage,
  IonToolbar,
  IonIcon,
  IonInput,
  IonRow,
  IonCol,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonImg,
  IonThumbnail
} from "@ionic/vue";
import { defineComponent } from "vue";
import { barcode } from "ionicons/icons";
import ApiClient from "@/services/api_client";
import Administration from "@/components/ART/administration.vue";
import Reports from "@/components/ART/reports.vue";
import Overview from "@/components/ART/overview.vue";
import { ProgramService } from "@/services/program_service";
export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonIcon,
    IonInput,
    IonRow,
    IonCol,
    IonButton,
    IonFooter,
    Administration,
    Reports,
    IonSegment,
    IonSegmentButton,
    Overview,
    IonLabel,
    IonCard,
    IonCardContent,
    IonImg,
    IonThumbnail
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
      this.createSessionLocationName(data);
    },
    createSessionLocationName(data: any) {
      sessionStorage.location = data.name;
      sessionStorage.locationName = data.name;
    },
    loadApplicationData() {
      this.ready = true;
      this.userLocation = sessionStorage.userLocation;
      this.userName = sessionStorage.username;
      this.fetchLocationID();
      this.fetchSessionDate();
    },
    async openModal() {
      const modal = await ProgramService.selectApplication();
      const  {data}  = await modal.onDidDismiss();
      this.applicationName = data.applicationName;
      this.applicationIcon = data.applicationIcon;
      await ProgramService.selectTasks().then(data => data.onDidDismiss)
      this.loadApplicationData();
    },
    checkForbarcode(){
        if(this.patientBarcode.match(/.+\$$/i) != null){
          const patientBarcode = this.patientBarcode.replaceAll(/\$/gi, '');
          this.patientBarcode = '';
          this.$router.push('/patients/confirm?patient_barcode='+patientBarcode);
        }
      },
  },
  setup() {
    return {
      barcode,
    };
  },
  mounted() {
      if (
        !Object.prototype.hasOwnProperty.call(sessionStorage, "applicationName")
      ) {
        this.openModal();
      } else {
        this.applicationName = sessionStorage.applicationName;
        this.applicationIcon = sessionStorage.applicationImage;
        this.loadApplicationData();
      }
  },
  watch: {
    patientBarcode: function() {
      this.checkForbarcode();
    }
  }
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
  font-size: 100%;
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
.barcode-input{
  height: 100%;
  font-size: 100%;
}
</style>
<template>
  <ion-page>
    <ion-header :translucent="true">
        <ion-toolbar>
      <ion-row >
      <ion-col size="0.5" >
          <ion-icon :icon="barcode" size="large" style="height: 100%;"></ion-icon>
      </ion-col>
      <ion-col size="3.5" class="outlined">
          <ion-input autofocus="true"></ion-input>
      </ion-col>
      <ion-col size="5">
        <p >Facility name: {{facilityName}}</p>
        <p>Location: {{userLocation}}</p>
        <p>Date: {{sessionDate}}</p>
        <p>User: {{userName}}</p>
      </ion-col>
      <ion-col size="3">
       {{applicationName}}
      </ion-col>
    </ion-row>
    </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      

      <div id="container">
        <p>Home content</p>
      </div>
    </ion-content>
   

  <ion-footer>
    <ion-toolbar>
     <ion-row>
       <ion-col>
        <ion-button color="danger left" size="large" router-link="/login">Logout</ion-button>
       </ion-col>
       <ion-col>

        <ion-button color="primary" size="large">Find By</ion-button>
       </ion-col>
       <ion-col>

        <ion-button color="success" size="large">Find or Register</ion-button>
       </ion-col>
       <ion-col>

        <ion-button color="primary" size="large" @click="openModal">Applications</ion-button>
       </ion-col>

     </ion-row>
    </ion-toolbar>
  </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, modalController, IonFooter, IonPage, IonTabs, IonTabBar,IonTabButton, IonTitle, IonToolbar, IonIcon,  IonInput, IonRow, IonCol, IonItem,
  IonText, IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';
import { barcode } from 'ionicons/icons';
import ApiClient from "@/services/api_client"
import Modal from '@/components/Modal.vue'
export default defineComponent({
  name: 'Home',
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
  },
  data() {
    return {
      facilityName: "",
      userLocation: "",
      sessionDate: "",
      userName: "",
      APIVersion: "",
      applicationName: ""
    }
  },
  methods: {
    fetchLocationID: async function() {
        const response = await ApiClient.get("global_properties?property=current_health_center_id");

        if (!response || response.status !== 200) return; // NOTE: Targeting Firefox 65, can't `response?.status`

        const data = await response.json();
        this.fetchLocationName(data.current_health_center_id);
      },
      fetchLocationUUID: async function() {
        const response = await ApiClient.get("global_properties?property=site_uuid");

        if (!response || response.status !== 200) return; // NOTE: Targeting Firefox 65, can't `response?.status`

        const data = await response.json();
        sessionStorage.siteUUID = data.site_uuid;
      },
      fetchSessionDate: async function() {
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
        this.facilityName =  data.name;
        this.createSessionLocationName(data);
      },
       createSessionLocationName(data: any){
        sessionStorage.location = data.name;
        sessionStorage.locationName = data.name;
      },
      async openModal() {
      const modal = await modalController
        .create({
          component: Modal,
          cssClass: 'my-custom-class',
          componentProps: {
            // title: 'New Title'
          },
        });

      modal.present();
      const { data } = await modal.onDidDismiss();
      this.applicationName = data.applicationName;
    },
    
  },
  setup() {
    return {
      barcode
    }
  },
  mounted() {
    if(!sessionStorage.applicationName) {
      this.openModal();
    }else {
     this.applicationName = sessionStorage.applicationName;
    }
    this.userLocation = sessionStorage.userLocation;
    this.userName = sessionStorage.username;
      if (!sessionStorage.apiKey) {
        this.$router.push('/login');
      }
      this.fetchLocationID(); 
      this.fetchSessionDate();
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
  
  .outlined{
    border: solid 1px grey;
  }
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
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
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-row>
          <ion-col size="1">
            <ion-icon
              :icon="gender === 'M' ? man : woman"
              size="large"
              style="height: 100%"
            ></ion-icon>
          </ion-col>
          <ion-col size="6"
            ><p>Patient Name: {{ patientName }}</p></ion-col
          >
          <ion-col size="3"
            ><p>Birthdate : {{ birthdate }}</p></ion-col
          >
          <ion-col size="3"
            ><p>Ancestry district: {{ ancestryDistrict }}</p></ion-col
          >
          <ion-col size="3"
            ><p>Ancestry TA: {{ ancestryTA }}</p></ion-col
          >
          <ion-col size="3"
            ><p>Ancestry village: {{ ancestryVillage }}</p></ion-col
          >
          <ion-col size="3"
            ><p>Current District : {{ currentDistrict }}</p></ion-col
          >
          <ion-col size="3"
            ><p>Current TA : {{ currentTA }}</p></ion-col
          >
          <ion-col size="3"
            ><p>Current Village : {{ currentVillage }}</p></ion-col
          >
        </ion-row>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-content> </ion-card-content>
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
            <ion-button color="success" size="large">Continue</ion-button>
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
  IonIcon,
  IonCard,
  IonCardContent,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { barcode, man, woman } from "ionicons/icons";
import ApiClient from "@/services/api_client";
import { Patient } from "@/interfaces/patient";
import { Patientservice } from "@/services/patient_service";
import dayjs from "dayjs";
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
    IonIcon,
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
      patientID: "",
      patientName: "",
      landmark: "",
      phoneNumber: "",
      currentDistrict: "",
      currentTA: "",
      currentVillage: "",
      ancestryDistrict: "",
      ancestryTA: "",
      ancestryVillage: "",
      gender: "",
      birthdate: "",
      dayjs,
    };
  },
  methods: {
    fetchPatient: async function () {
      const response = await ApiClient.get(`/patients/${this.patientID}`);

      if (!response || response.status !== 200) return; // NOTE: Targeting Firefox 65, can't `response?.status`

      const data: Patient = await response.json();
      const patient = new Patientservice(data);
      this.patientName = patient.getFullName();
      this.landmark = patient.getAttribute(19);
      this.phoneNumber = patient.getAttribute(12);
      const addresses = patient.getAddresses();
      this.gender = data.person.gender;
      this.birthdate = dayjs(data.person.birthdate).format("DD/MMM/YYYY");
      this.ancestryDistrict = addresses.ancestryDistrict;
      this.ancestryTA = addresses.ancestryTA;
      this.ancestryVillage = addresses.ancestryVillage;
      this.currentDistrict = addresses.currentDistrict;
      this.currentTA = addresses.currentTA;
      this.currentVillage = addresses.ancestryVillage;
    }
  },
  setup() {
    return {
      barcode,
      man,
      woman,
    };
  },
  mounted() {
    this.patientID = this.$route.params.person_id as any;
    this.fetchPatient();
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
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
      <ion-row>
        <ion-col size="4" v-for="(card, index) in cards" :key="index">
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{card.title}}</ion-card-title>
            </ion-card-header>

            <ion-card-content>

              <h2 v-for="(info, id) in card.data" :key="id">
              {{info.label}} {{ info.value }}</h2>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
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
            <ion-button
              color="danger left"
              size="large"
              router-link="/"
              v-if="isAdmin"
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
import { Role } from "@/interfaces/role";
import { Observation } from "@/interfaces/observation";
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
      cards: [] as any,
      ARVNumber: "",
      NPID: "",
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
      this.ARVNumber = patient.getPatientIdentifier(4);
      const ARVNumber= patient.getPatientIdentifier(4);
      const NPID = patient.getPatientIdentifier(3);
      this.cards.push({
        title: 'PATIENT IDENTIFIERS',
        data: [
          {
            label: "ARV Number",
            value: ARVNumber
          },
          {
            label: "NPID",
            value: NPID
          }
        ]
      });
      await this.fetchAlerts()
      .then(this.fetchLabOrders)
      .then(this.fetchProgramInfo)
      .then(this.fetchOutCome)
      .then(this.fetchGuardians)
    },
    fetchAlerts: async function() {
      const response = await ApiClient.get(`/observations?person_id=${this.patientID}&concept_id=7755`);

      if (!response || response.status !== 200) return;
      const data: Observation[] = await response.json();
      const sideEffects: Observation[] = data.filter(observation=>{
        return observation.children[0].value_coded == 1065;
      });

      const displayData = {
        title: "ALERTS",
        data: [
          {
          label: "Side effects",
          value: sideEffects.length
          }
        ]
      }

      this.cards.push(displayData);

    },
    fetchLabOrders: async function() {
      const displayData = {
        title: "Labs",
        data: [
          
        ]
      }
      this.cards.push(displayData);
    },
    fetchProgramInfo: async function() {
      const displayData = {
        title: "PROGRAM INFORMATION",
        data: [
          
        ]
      }
      this.cards.push(displayData);
    },
    fetchOutCome: async function() {
      const displayData = {
        title: "Outcome",
        data: [
          
        ]
      }
      this.cards.push(displayData);
    },
    fetchGuardians: async function() {
      const displayData = {
        title: "GUARDIAN(s)",
        data: [
          
        ]
      }
      this.cards.push(displayData);
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
  computed: {
    isAdmin() {
      const roles = JSON.parse(sessionStorage.userRoles).filter(
        (role: Role) => {
          return role.role.match(/super|admin/i);
        }
      );
      return roles.length > 0;
    },
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
ion-card {
  height: 250px;
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
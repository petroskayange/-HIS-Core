<template>

  <ion-page>
  <ion-loading
    :is-open="isOpenRef"
    cssClass="my-custom-class"
    message="Please wait..."
  >
  </ion-loading>
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
              <ion-card-title>{{ card.title }}</ion-card-title>
            </ion-card-header>

            <ion-card-content>
              <h2 v-for="(info, id) in card.data" :key="id">
                {{ info.label }} <strong> {{ info.value }}</strong>
              </h2>
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
            <ion-button color="success" size="large" @click="nextTask">Continue</ion-button>
          </ion-col>
        </ion-row>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
interface DataInterface {
  label: string;
  value: string;
}
import {
  IonContent,
  IonHeader,
  IonFooter,
  IonPage,
  IonToolbar,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonLoading,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { barcode, man, woman } from "ionicons/icons";
import ApiClient from "@/services/api_client";
import { Patient } from "@/interfaces/patient";
import { Observation } from "@/interfaces/observation";
import { ObservationService } from "@/services/observation_service";
import { Patientservice } from "@/services/patient_service";
import { ProgramService } from "@/services/program_service";
import { OrderService } from "@/services/order_service";
import { UserService } from "@/services/user_service";
import { RelationshipService } from "@/services/relationship_service";
import { ConceptService } from "@/services/concept_service"
import { alertAction } from "@/utils/Alerts"
import { WorkflowService } from "@/services/workflow_service"
import PatientAlerts from "@/services/patient_alerts"
import HisDate from "@/utils/Date"
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
    IonCardTitle,
    IonCardHeader, 
    IonLoading
  },
  data() {
    return {
      patientBarcode: "" as any,
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
      patientID: "" as any
    };
  },
  methods: {
    async nextTask() {
      const params = await WorkflowService.getNextTaskParams(this.patientID)
      this.$router.push(params)
    },
    alertPatientNotFound() {
      alertAction('Patient not found', [
        {
          text: 'Home',
          handler: () => this.$router.push('/')
        },
        {
          text: 'Back',
          handler: () => this.$router.back()
        }
      ])
    },
    fetchPatient: async function () {
      const response = await ApiClient.get(`/patients/${this.patientID}`);

      this.setOpen(true);
      if (!response || response.status !== 200) {
        this.setOpen(false);
        this.alertPatientNotFound();

      } // NOTE: Targeting Firefox 65, can't `response?.status`
      else {
        const data: Patient = await response.json();
        this.parsePatient(data);
      }
    },
    fetchPatientByID: async function() {
      this.setOpen(true);
      const response = await ApiClient.get(`/search/patients/by_npid?npid=${this.patientBarcode}`);

      if (!response || response.status !== 200) {
        this.setOpen(false);
        this.alertPatientNotFound();
      } 
      else {
        const data: Patient[] = await response.json();

        switch (data.length) {
          case 0:
            this.alertPatientNotFound();
            this.setOpen(false);
            break;
          case 1:
            this.patientID = data[0].patient_id; 
            this.parsePatient(data[0]);
            break;
          default:
            console.log('duplicates');
            break;
        }
      }
    },
    parsePatient: async function(data: Patient) {
        const patient = new Patientservice(data);
        this.patientName = patient.getFullName();
        this.landmark = patient.getAttribute(19);
        this.phoneNumber = patient.getAttribute(12);
        const addresses = patient.getAddresses();
        this.gender = data.person.gender;
        this.birthdate = HisDate.toStandardHisDisplayFormat(data.person.birthdate);
        this.ancestryDistrict = addresses.ancestryDistrict;
        this.ancestryTA = addresses.ancestryTA;
        this.ancestryVillage = addresses.ancestryVillage;
        this.currentDistrict = addresses.currentDistrict;
        this.currentTA = addresses.currentTA;
        this.currentVillage = addresses.ancestryVillage;
        this.ARVNumber = patient.getPatientIdentifier(4);
        const ARVNumber = patient.getPatientIdentifier(4);
        const NPID = patient.getPatientIdentifier(3);
        this.cards.push({
          title: "PATIENT IDENTIFIERS",
          data: [
            {
              label: "ARV Number",
              value: ARVNumber,
            },
            {
              label: "NPID",
              value: NPID,
            },
          ],
        });
        await this.fetchAlerts()
          .then(this.fetchLabOrders)
          .then(this.fetchProgramInfo)
          .then(this.fetchGuardians)

          this.setOpen(false);
    },
    fetchAlerts: async function () {
      const sideEffects: Observation[] = await PatientAlerts.alertSideEffects(this.patientID)
      const displayData = {
        title: "ALERTS",
        data: [
          {
            label: "Side effects",
            value: sideEffects.length,
          },
        ],
      };

      this.cards.push(displayData);
    },
    fetchLabOrders: async function () {
      const displayData = {
        title: "Labs",
        data: [] as DataInterface[],
      };
      await OrderService.getOrders(this.patientID).then((orders) => {
        const VLOrders = OrderService.getViralLoadOrders(orders);
        VLOrders.forEach((element) => {
          displayData.data.push({
            value: OrderService.formatOrders(element),
            label: ``,
          });
        });
      });

      this.cards.push(displayData);
    },
    fetchProgramInfo: async function () {
      const displayData = {
        title: "PROGRAM INFORMATION",
        data: [] as DataInterface[],
      };
      let outcome = "";
      await ProgramService.getNextTask(this.patientID).then(
        (task) => {
          displayData.data.push({
            label: "Next Task",
            value: task.name,
          });
        }
      );
      await ProgramService.getProgramInformation(this.patientID).then(
        (task) => {
          displayData.data.push({
            label: "ART Duration",
            value: `${task.art_duration} month(s) `,
          });
          outcome = task.current_outcome;
        }
      );
      await ProgramService.getFastTrackStatus(this.patientID).then(
        (task) => {
          const data = task["Continue FT"] === true ? "Yes" : "No";
          displayData.data.push({
            label: "On Fast Track",
            value: data,
          });
        }
      );
      const appointMentObs: Observation[] = await ObservationService.getObservations(
        this.patientID,
        ConceptService.getCachedConceptID('appointment date')
      );
      if (appointMentObs.length > 0) {
        const nextAPPT = HisDate.toStandardHisDisplayFormat(appointMentObs[0].value_datetime);
        displayData.data.push({
          label: "Next Appointment",
          value: nextAPPT,
        });
      }
      this.cards.push(displayData);
      this.fetchOutCome(outcome);
    },
    fetchOutCome: async function (outcome: string) {
      const displayData = {
        title: "Outcome",
        data: [
          {
            label: "Current Outcome",
            value: outcome,
          },
        ] as DataInterface[],
      };
      this.cards.push(displayData);
    },
    fetchGuardians: async function () {
      RelationshipService.getGuardianDetails(
        this.patientID
      ).then((relationship: any) => {
        const rel: DataInterface[] = relationship.map((r: any) => {
          return {
            label: r.name,
            value: r.relationshipType,
          };
        });
        const displayData = {
          title: "GUARDIAN(s)",
          data: { ...rel },
        };
        this.cards.push(displayData);
      });
    },
    setupconfirmation(query: any) {
      this.resetState();
      if(query.person_id) {
        const patientID = query.person_id as any;
        this.patientID = parseInt(patientID);
        this.fetchPatient();
      }else if(query.patient_barcode) {
        const patientBarcode = query.patient_barcode as any;
        this.patientBarcode = patientBarcode.replace(/-/g, "");
        this.fetchPatientByID();
      }
    },
    resetState() {
       this.patientBarcode = "";
        this.patientName =  "";
        this.landmark = "";
        this.phoneNumber = "";
        this.currentDistrict = "";
        this.currentTA = "";
        this.currentVillage = "";
        this.ancestryDistrict = "";
        this.ancestryTA = "";
        this.ancestryVillage = "";
        this.gender = "";
        this.birthdate = "";
        this.cards =  [];
        this.ARVNumber = "";
        this.NPID = "";
        this.patientID =  "";
    }
     
  },
  setup() {
    const isOpenRef = ref(true);
    const setOpen = (state: boolean) => isOpenRef.value = state;

    return { isOpenRef, setOpen,
      barcode,
      man,
      woman,
    };
  },
   watch: {
    $route: {
      async handler({ query }: any) {
       this.setupconfirmation(query);
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    isAdmin() {
      return UserService.isAdmin;
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
</style>
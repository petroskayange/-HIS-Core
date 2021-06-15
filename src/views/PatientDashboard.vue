<template>
    <ion-page> 
        <ion-content>
            <ion-grid>
                <ion-row> 
                    <ion-col size="5"> 
                        <info-card :title="patient.title" :icon="patient.icon" :items="patient.info"/> 
                    </ion-col>
                    <ion-col size="5"> 
                        <info-card :title="treatment.title" :icon="treatment.icon" :items="treatment.info"/> 
                    </ion-col>
                    <ion-col size="2"> 
                        <info-card :title="treatment.title" :icon="treatment.icon" :items="[]"/> 
                    </ion-col>
                </ion-row>
                <ion-row> 
                    <ion-col size="2">
                        <div class="large-card"> 
                            <h4> Visits: </h4>
                        </div>
                    </ion-col>
                    <ion-col size="10"> 
                        <ion-row> 
                            <ion-col>
                                <primary-card title="7 Activities" :items="activities"> </primary-card>
                            </ion-col>
                            <ion-col>
                                <primary-card title="Lab Orders" :items="labOrders" titleColor="#5cb85c"> </primary-card>
                            </ion-col>
                        </ion-row>
                        <ion-row> 
                            <ion-col> 
                                <primary-card title="Alerts" :items="alerts" titleColor="#d9534f"> </primary-card>
                            </ion-col>
                            <ion-col> 
                                <primary-card title="Medications" :items="medications" titleColor="#f0ad4e"> </primary-card>
                            </ion-col>
                        </ion-row>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
        <ion-footer> 
            <ion-toolbar color="dark">
                <ion-button color="danger" size="large" router-link="/"> 
                    Cancel
                </ion-button>
                <ion-button color="primary" size="large" slot="end"> 
                    Tasks
                </ion-button>
                <ion-button color="primary" size="large" slot="end"> 
                    Printouts/Other
                </ion-button>
                <ion-button color="primary" size="large" slot="end"> 
                    Applications
                </ion-button>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import InfoCard from "@/components/DataViews/DashboardSecondaryInfoCard.vue"
import PrimaryCard from "@/components/DataViews/DashboardPrimaryCard.vue"
import { person } from "ionicons/icons";

import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
  IonToolbar,
} from "@ionic/vue";
export default defineComponent({
    components: {
        PrimaryCard,
        InfoCard,
        IonPage,
        IonFooter,
        IonContent,
        IonButton,
        IonToolbar,
        IonGrid,
        IonRow,
        IonCol,
    },
    data: () => ({
        patient: {
            icon: person,
            info: [
                { label: "Name", value: "Andrew Mfune"},
                { label: "Birthdate", value: "06/Feb/2021" },
                { label: "Current Village", value: "Unknown" },
                { label: "Phone#", value: "N/A" }
            ],
            title: 'Test Patient'
        },
        treatment: {
            icon: null,
            title: "Treatment",
            info: [
                { label: "ART- Start Date", value: "No Start date"},
                { label: "ARV Number", value: "No ARV Number" },
                { label: "File Number", value: "No filing Number Available"},
                { label: "Current Outcome", value: "Unknown"}
            ]
        },
        labOrders: [
            { label: "Viral Load", value: "09:30"}
        ],
        activities: [
            {label: "HIV STAGING", value: "08:30"},
            {label: "REGISTRATION", value: "08:30"},
            {label: "LAB ORDER", value: "08:30"},
        ],
        medications: [
            {label: "Rifepentine 150mg", value: "09:00"},
            {label: "CPT 150mg", value: "09:00"},
            {label: "Some ARV 150mg", value: "09:00"},
        ],
        alerts: [
            { label: "Patient has 0 side effects", value: ""}
        ]
    })
})
</script>
<style scoped>
.large-card {
  padding: 5%;
  border-radius: 6px;
  border: 1px solid #ccc;
  height: 70vh;
  background-color: rgb(255, 255, 255);
  overflow-y: auto;
  -webkit-box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
  -moz-box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
  box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
}
</style>
<template>
    <ion-page> 
        <ion-header :translucent="true"> 
            <ion-toolbar> 
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
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-grid>
                <ion-row> 
                    <ion-col size="2">
                        <visit-dates-card :title="visitDatesTitle" :items="visitDates"> </visit-dates-card>
                    </ion-col>
                    <ion-col size="10"> 
                        <ion-row> 
                           <ion-col> 
                               <b>Today's Date:</b> {{ currentDate }}
                            </ion-col> 
                            <ion-col> 
                                <b>Next Task:</b> {{ nextTask }}
                            </ion-col>
                            <ion-col> 
                                <b>Set Date:</b> {{ sessionDate }}
                            </ion-col>
                        </ion-row>
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
import VisitDatesCard from "@/components/DataViews/VisitDatesCard.vue"
import { person } from "ionicons/icons";
import HisDate from "@/utils/Date"

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
        VisitDatesCard,
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
        currentDate: HisDate.currentDisplayDate(),
        sessionDate: HisDate.sessionDisplayDate(),
        nextTask: "None",
        patient: {
            icon: person,
            info: [
                { label: "Name", value: "Andrew Mfune"},
                { label: "Birthdate", value: "06/Feb/2021" },
                { label: "Current Village", value: "Unknown" },
                { label: "Phone#", value: "N/A" },
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
        visitDates: [
            { label: "20/Jun/2021", value: ""},
            { label: "20/Jun/2021", value: ""},
            { label: "20/Jun/2021", value: ""},
            { label: "20/Jun/2021", value: ""},
            { label: "20/Jun/2021", value: ""}
        ],
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
    }),
    computed: {
        visitDatesTitle(): string {
            return `${this.visitDates.length} Visits`
        }
    }
})
</script>
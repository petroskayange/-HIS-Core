<template>
    <ion-page> 
        <ion-header :translucent="true"> 
            <ion-toolbar> 
                <ion-row> 
                    <ion-col size="5"> 
                        <info-card :items="patientCardInfo"/> 
                    </ion-col>
                    <ion-col size="5"> 
                        <info-card :items="programCardInfo"/> 
                    </ion-col>
                    <ion-col size="2"> 
                        <info-card :items="[]"/> 
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
                           <ion-col size="4"> 
                               <b>Today's Date:</b> {{ currentDate }}
                            </ion-col> 
                            <ion-col size="5"> 
                                <b>Next Task:</b> {{ nextTask }}
                            </ion-col>
                            <ion-col size="3"> 
                                <b>Set Date:</b> {{ sessionDate }}
                            </ion-col>
                        </ion-row>
                        <ion-row> 
                            <ion-col>
                                <primary-card title="Activities" :items="activities"> </primary-card>
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
import HisDate from "@/utils/Date"
import { Patient } from "@/interfaces/patient";
import { Patientservice } from "@/services/patient_service"
import { ProgramService } from "@/services/program_service"
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
        patientId: 0,
        patient: {} as any,
        patientProgram: {} as any,
        patientCardInfo: [] as any,
        programCardInfo: [] as any,
        encounters: [] as any,
        visitDates: [] as any,
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
    },
    watch: {
        "$route" : {
            async handler({query}: any) {
                this.patientId = parseInt(query.patient_id)
                this.patient = await this.fetchPatient(this.patientId)
                this.patientProgram = await ProgramService.getProgramInformation(this.patientId)
                this.nextTask = await this.getNextTask(this.patientId)
                this.visitDates = await this.getPatientVisitDates(this.patientId)
                this.patientCardInfo = this.getPatientCardInfo(this.patient)
                this.programCardInfo = this.getProgramCardInfo(this.patientProgram)
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        async fetchPatient(patientId: number | string){
            const patient: Patient = await Patientservice.findByID(patientId);
            return patient ? new Patientservice(patient): {}
        },
        getProp(data: any, prop: string): string {
            return prop in data ? data[prop]() : '-'
        },
        async getPatientVisitDates(patientId: number) {
            const dates = await Patientservice.getPatientVisits(patientId)
            return dates.map((date: string) => ({
                label: HisDate.toStandardHisDisplayFormat(date),
                value: date
            }))
        },
        async getNextTask(patientId: number) {
            try {
                const {name} = await ProgramService.getNextTask(patientId)
                return name
            }catch(e) {
                return 'None'
            }
        },
        getPatientCardInfo(patient: any) {
            const {toStandardHisDisplayFormat, getAgeInYears} = HisDate
            const birthDate = this.getProp(patient, 'getBirthdate')
            return [
                { label: 'NPID', value: this.getProp(patient, 'getNationalID') },
                { label: "Name", value: this.getProp(patient, 'getFullName')},
                { label: "Birthdate", value: `${toStandardHisDisplayFormat(birthDate)} (${getAgeInYears(birthDate)})`},
                { label: "Current Village", value: this.getProp(patient, 'getCurrentVillage')},
                { label: "Phone#", value: "#coming soon" },
            ]
        },
        getProgramCardInfo(programInfo: any) {
           return  [
                { label: "ART- Start Date", value: programInfo.art_start_date},
                { label: "ARV Number", value: programInfo.arv_number },
                { label: "File Number", value: programInfo.filing_number.number},
                { label: "Current Outcome", value: programInfo.current_outcome},
                { label: "Current Regimen", value: programInfo.current_regimen},
           ]
        }  
    }
})
</script>
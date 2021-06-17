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
                        <icon-card :icon="appIcon"> </icon-card>
                    </ion-col>
                </ion-row>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-grid>
                <ion-row> 
                    <ion-col size="2">
                        <visit-dates-card :title="visitDatesTitle" :items="visitDates" @onselect="onActiveVisitDate"> </visit-dates-card>
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
                                <primary-card title="Activities" :items="encountersCardItems" titleColor="#658afb"> </primary-card>
                            </ion-col>
                            <ion-col>
                                <primary-card title="Lab Orders" :items="labOrderCardItems" titleColor="#69bb7b"> </primary-card>
                            </ion-col>
                        </ion-row>
                        <ion-row> 
                            <ion-col> 
                                <primary-card title="Alerts" :items="alertCardItems" titleColor="#f95d5d"> </primary-card>
                            </ion-col>
                            <ion-col> 
                                <primary-card title="Medications" :items="medicationCardItems" titleColor="#fdb044"> </primary-card>
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
import { Encounter } from "@/interfaces/encounter"
import { Option } from "@/components/Forms/FieldInterface"
import { Patient } from "@/interfaces/patient";
import { Patientservice } from "@/services/patient_service"
import { ProgramService } from "@/services/program_service"
import { DrugOrderService } from "@/services/drug_order_service"
import { OrderService } from "@/services/order_service"
import PatientAlerts from "@/services/patient_alerts"
import IconCard from "@/components/DataViews/DashboardAppIcon.vue"
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
import { EncounterService } from '@/services/Encounter'
export default defineComponent({
    components: {
        VisitDatesCard,
        PrimaryCard,
        InfoCard,
        IconCard,
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
        appIcon: '',
        currentDate: HisDate.currentDisplayDate(),
        sessionDate: HisDate.sessionDisplayDate(),
        nextTask: "None",
        patientId: 0,
        patient: {} as any,
        patientProgram: {} as Array<Option>,
        patientCardInfo: [] as Array<Option>,
        programCardInfo: [] as Array<Option>,
        encounters: [] as Array<Encounter>,
        medications: [] as any,
        labOrders: [] as any,
        visitDates: [] as Array<Option>,
        activeVisitDate: '' as string | number,
        encountersCardItems: [] as Array<Option>,
        medicationCardItems: [] as Array<Option>,
        labOrderCardItems: [] as Array<Option>,
        alertCardItems: [] as Array<Option>
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
                this.alertCardItems = await this.getPatientAlertCardInfo(this.patientId)
                this.patientCardInfo = this.getPatientCardInfo(this.patient)
                this.programCardInfo = this.getProgramCardInfo(this.patientProgram)
                this.appIcon = ProgramService.getApplicationImage() || ''
            },
            deep: true,
            immediate: true
        },
        async activeVisitDate(date: string) {
            this.encounters = await EncounterService.getEncounters(this.patientId, {date})
            this.medications = await DrugOrderService.getOrderByPatient(this.patientId, {'start_date': date})
            this.labOrders = await OrderService.getOrders(this.patientId, {date})
            this.encountersCardItems = this.getActivitiesCardInfo(this.encounters)
            this.medicationCardItems = this.getMedicationCardInfo(this.medications)
            this.labOrderCardItems = this.getLabOrderCardInfo(this.labOrders)
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
        onActiveVisitDate(data: Option) {
            this.activeVisitDate = data.value
        },
        getPatientCardInfo(patient: any) {
            const {toStandardHisDisplayFormat, getAgeInYears} = HisDate
            const birthDate = this.getProp(patient, 'getBirthdate')
            return [
                { label: 'NPID', value: this.getProp(patient, 'getNationalID') },
                { label: "Name", value: this.getProp(patient, 'getFullName')},
                { label: "Birthdate", value: `${toStandardHisDisplayFormat(birthDate)} (${getAgeInYears(birthDate)})`},
                { label: "Current Village", value: this.getProp(patient, 'getCurrentVillage')},
                { label: "Phone#", value: this.getProp(patient, 'getPhoneNumber') },
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
        },
        getActivitiesCardInfo(encounters: Array<Encounter>) {
            return encounters.map((encounter: Encounter) => ({
                label: encounter.type.name,
                value: HisDate.toStandardHisTimeFormat(encounter.encounter_datetime)
            }))
        },
        getMedicationCardInfo(medications: any) {
            return medications.map((medication: any) => ({
                label: medication.drug.name,
                value: HisDate.toStandardHisTimeFormat(medication.order.start_date)
            }))
        },
        getLabOrderCardInfo(labOrders: any) {
            return labOrders.map((labOrder: any) => ({
                label: labOrder.specimen.name,
                value: HisDate.toStandardHisTimeFormat(labOrder.order_date)
            }))
        },
        async getPatientAlertCardInfo(patientId: number){
            const sideEffects = await PatientAlerts.alertSideEffects(patientId)
            return [
                { label: `Patient has ${sideEffects.length} side effects`, value: ''}
            ]
        }
    }
})
</script>
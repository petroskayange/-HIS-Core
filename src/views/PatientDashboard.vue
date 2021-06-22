<template>
    <ion-page> 
        <patient-header :appIcon="appIcon" :patientCardInfo="patientCardInfo" :programCardInfo="programCardInfo" />
        <ion-content>
            <ion-grid class='grid-custom'>
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
                                <primary-card :title="`${encountersCardItems.length} Activities`" :items="encountersCardItems" titleColor="#658afb" @click="showAllEncounters"> </primary-card>
                            </ion-col>
                            <ion-col>
                                <primary-card :title="`${labOrderCardItems.length} Lab Orders`" :items="labOrderCardItems" titleColor="#69bb7b" @click="showAllLabOrders"> </primary-card>
                            </ion-col>
                        </ion-row>
                        <ion-row> 
                            <ion-col> 
                                <primary-card :title="`${alertCardItems.length} Alerts`" :items="alertCardItems" titleColor="#f95d5d"> </primary-card>
                            </ion-col>
                            <ion-col> 
                                <primary-card :title="`${medicationCardItems.length} Medications`" :items="medicationCardItems" titleColor="#fdb044" @click="showAllMedications"> </primary-card>
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
                <ion-button color="primary" size="large" slot="end" @click="showTasks"> 
                    Tasks
                </ion-button>
                <ion-button color="primary" size="large" slot="end" @click="showOptions"> 
                    Printouts/Other
                </ion-button>
                <ion-button color="primary" size="large" slot="end" @click="changeApp"> 
                    Applications
                </ion-button>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import PrimaryCard from "@/components/DataViews/DashboardPrimaryCard.vue"
import VisitDatesCard from "@/components/DataViews/VisitDatesCard.vue"
import HisDate from "@/utils/Date"
import { Encounter } from "@/interfaces/encounter"
import { Option } from "@/components/Forms/FieldInterface"
import { Patient } from "@/interfaces/patient";
import { Patientservice } from "@/services/patient_service"
import { ProgramService } from "@/services/program_service"
import { ObservationService } from "@/services/observation_service"
import { DrugOrderService } from "@/services/drug_order_service"
import { OrderService } from "@/services/order_service"
import PatientAlerts from "@/services/patient_alerts"
import TaskSelector from "@/components/DataViews/TaskSelector.vue"
import PatientHeader from "@/components/Toolbars/PatientDashboardToolBar.vue"
import EncounterView from "@/components/DataViews/EncounterView.vue"
import CardDrilldown from "@/components/DataViews/DashboardCardDrillDown.vue"
import { man, woman } from "ionicons/icons";
import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
  IonToolbar,
  modalController
} from "@ionic/vue";
import { EncounterService } from '@/services/Encounter'
export default defineComponent({
    components: {
        PatientHeader,
        VisitDatesCard,
        PrimaryCard,
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
        currentDate: '',
        sessionDate: '',
        nextTask: "None",
        patientId: 0,
        programID : 0,
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

                if (this.patientId) this.init()
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
        async init() {
            this.patient = await this.fetchPatient(this.patientId)
            this.patientProgram = await ProgramService.getProgramInformation(this.patientId)
            this.nextTask = await this.getNextTask(this.patientId)
            this.visitDates = await this.getPatientVisitDates(this.patientId)
            this.alertCardItems = await this.getPatientAlertCardInfo(this.patientId)
            this.patientCardInfo = this.getPatientCardInfo(this.patient)
            this.programCardInfo = this.getProgramCardInfo(this.patientProgram)
            this.programID = ProgramService.getProgramID()
            this.currentDate = HisDate.currentDisplayDate()
            this.sessionDate = HisDate.toStandardHisDisplayFormat(ProgramService.getSessionDate())
            this.appIcon = ProgramService.getApplicationImage() || ''
        },
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
            const genderIcon = this.getProp(patient, 'getGender') === 'M' ? man : woman
            return [
                { label: "Name", value: this.getProp(patient, 'getFullName'), other: { icon: genderIcon}},
                { label: "Birthdate", value: `${toStandardHisDisplayFormat(birthDate)} (${getAgeInYears(birthDate)}) (${this.getProp(patient, 'getNationalID')})`},
                { label: "Current Village", value: this.getProp(patient, 'getCurrentVillage')},
                { label: "Phone#", value: this.getProp(patient, 'getPhoneNumber')}
            ]
        },
        getProgramCardInfo(programInfo: any) {
           return  [
            { label: "ART- Start Date", value: programInfo.art_start_date},
            { label: "ARV Number", value: `${programInfo.arv_number} | Current regimen: ${programInfo.current_regimen}` },
            { label: "File Number", value: programInfo.filing_number.number},
            { label: "Current Outcome", value: programInfo.current_outcome},
           ]
        },
        getActivitiesCardInfo(encounters: Array<Encounter>) {
            return encounters.map((encounter: Encounter) => ({
                label: encounter.type.name,
                value: HisDate.toStandardHisTimeFormat(encounter.encounter_datetime),
                other: {
                    id: encounter.encounter_id,
                    columns: ['Observation', 'Value', 'Time'],
                    getRows: async () => {
                        const data = []
                        const { observations } = encounter
                        for(const index in observations) {
                            const obs =  observations[index]
                            const concept = obs.concept.concept_names[0].name
                            const value = await ObservationService.resolvePrimaryValue(obs)
                            const time = HisDate.toStandardHisTimeFormat(obs.obs_datetime)
                            data.push([concept, value, time])
                        }
                        return data
                    }
                }
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
        },
        async changeApp() {
            const modal = await ProgramService.selectApplication();
            const {data}  = await modal.onDidDismiss();

            await ProgramService.selectTasks().then(data => data.onDidDismiss)
            
            if (parseInt(data.programID) != this.programID) this.init()
        },
        async showTasks() {
            const {encounters} = ProgramService.getApplicationConfig()
            this.openModal(encounters, 'Select Task', TaskSelector)
        },
        async showOptions() {
            const {options} = ProgramService.getApplicationConfig()
            this.openModal(options, 'Select Activity', TaskSelector)
        },
        async openModal(items: any, title: string, component: any) {
            const date = HisDate.toStandardHisDisplayFormat(this.activeVisitDate.toString())
            const modal = await modalController.create({
                component: component,
                backdropDismiss: true,
                cssClass: "custom-modal",
                componentProps: {
                    items,
                    title: `${title}: ${date}`
                }
            })
            modal.present()
        },
        async openTableModal(columns: any, rows: any, title: string) {
            const date = HisDate.toStandardHisDisplayFormat(this.activeVisitDate.toString())
            const modal = await modalController.create({
                component: CardDrilldown,
                backdropDismiss: true,
                cssClass: "custom-modal",
                componentProps: {
                    columns,
                    rows,
                    title: `${title}: ${date}`
                }
            })
            modal.present()
        },
        showAllEncounters() {
            this.openModal(this.encountersCardItems, 'Activities', EncounterView)
        },
        showAllMedications() {
            const columns = ['Medication', 'Start date', 'End date', 'Amount given']
            const rows = this.medications.map((medication: any) => ([
                medication.drug.name, 
                HisDate.toStandardHisDisplayFormat(medication.order.start_date),
                HisDate.toStandardHisDisplayFormat(medication.order.auto_expire_date),
                medication.quantity
            ]))
            this.openTableModal(columns, rows, 'Medication History')
        },
        showAllLabOrders() {
            const columns = ['Accession#',  'Specimen', 'Time']
            const rows = this.labOrders.map((order: any) => ([
                order.accession_number, 
                order.specimen.name,
                HisDate.toStandardHisTimeFormat(order.order_date)
            ]))
            this.openTableModal(columns, rows, `Lab Orders`)
        }
    }
})
</script>
<style scoped>
    .grid-custom {
        height: 99%;
        overflow: hidden;
    }
</style>
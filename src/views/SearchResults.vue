<template>
    <ion-page> 
        <ion-content> 
            <ion-row> 
                <ion-col> 
                    <h2> Results </h2>
                    <his-select :options="getPatientOptions" @onValue="setDemographics" :fdata="{}"> </his-select>
                </ion-col>
                <ion-col>
                    <h2> Patient Details </h2>
                    <view-port> 
                        <list-view :fieldItems="this.demographics"> </list-view> 
                    </view-port>
                </ion-col>
            </ion-row>
        </ion-content>
        <ion-footer>
            <ion-toolbar color="dark">
                <ion-button color="danger" size="large" router-link="/">
                    Cancel
                </ion-button>
                <ion-button slot="end" color="primary" size="large" router-link="/search_patient">
                    New Search
                </ion-button>
                <ion-button slot="end" color="primary" size="large">
                    New Patient
                </ion-button>
                <ion-button slot="end" color="success" size="large">
                    Finish
                </ion-button>
            </ion-toolbar>
        </ion-footer>
    </ion-page>    
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import {IonRow, IonPage, IonCol, IonContent, IonButton, IonFooter, IonToolbar} from "@ionic/vue"
import { Patientservice } from "@/services/patient_service"
import { Patient } from "@/interfaces/patient"
import { Option } from "@/components/Forms/FieldInterface"
import HisSelect from "@/components/FormElements/HisSelect.vue"
import ListView from "@/components/DataViews/HisFormSummary.vue"
import ViewPort from "@/components/DataViews/ViewPort.vue"

export default defineComponent({
    components: { IonRow, IonPage, IonFooter, IonContent, IonButton, IonCol, IonToolbar, HisSelect, ListView, ViewPort},
    data:() => ({
        demographics: [
            { label: 'Patient ID', value: ''},
            { label: 'Name', value: ''},
            { label: 'Gender', value:''},
            { label: 'Birthdate', value: '' },
            { label: 'Home District', value: ''},
            { label: 'Home Village', value: '' },
            { label: 'Current District', value: ''},
            { label: 'Current T/A', value: ''}
        ] as Array<Option>,
        gname: '' as any,
        fname: '' as any,
        gender: '' as any
    }),
    async created() {
        this.gname = this.$route.query.given_name
        this.fname = this.$route.query.family_name
        this.gender = this.$route.query.gender
    },
    methods: {
        async getPatientOptions(){
            const patients = await Patientservice.searchByName(this.gname, this.fname)
            return patients.map((item: Patient) => {
                console.log(item)
                const patient = new Patientservice(item)
                return {
                    label: patient.getPatientInfoString(),
                    value: patient.getID(),
                    other: patient
                }
            })
        },
        setDemographics({other}: any) {
            if (typeof other != 'object') return
          
            const patientService = other

            this.demographics = [
                {
                    label: 'Patient ID',
                    value: patientService.getNationalID()
                },
                {
                    label: 'Name',
                    value: patientService.getFullName()
                },
                {
                    label: 'Gender',
                    value: patientService.getGender()
                },
                {
                    label: 'Birthdate',
                    value: patientService.getBirthdate()
                },
                {
                    label: 'Home District',
                    value: patientService.getHomeDistrict()
                },
                {
                    label: 'Home Village',
                    value: patientService.getHomeVillage()
                },
                {
                    label: 'Current District',
                    value: patientService.getCurrentDistrict()
                },
                {
                    label: 'Current T/A',
                    value: patientService.getCurrentTA()
                }
            ]
        }
    }
})
</script>
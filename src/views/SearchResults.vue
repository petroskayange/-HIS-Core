<template>
    <ion-page> 
        <ion-content> 
            <ion-row> 
                <ion-col> 
                    <result-card :title="resultTitle" :subtitle="resultSubtitle" :icon="genderIcon" />
                </ion-col>
            </ion-row>
            <ion-row> 
                <ion-col size="5"> 
                    <div class="large-card"> 
                        <ion-list>
                            <ion-item button v-for="(result, index) in results" :key="index" :detail="true" @click="onselect(result.other)">
                                {{result.label}}
                            </ion-item>
                        </ion-list>
                    </div>
                </ion-col>
                <ion-col size="7">
                    <div class="large-card"> 
                        <ion-list> 
                            <ion-item v-for="(opt, index) in demographics" :key="index" inset="none">
                                <ion-label> {{opt.label}} </ion-label>  
                                <ion-label slot="end"> {{opt.value}} </ion-label>
                            </ion-item>
                        </ion-list>
                    </div>
                </ion-col>
            </ion-row>
        </ion-content>
        <ion-footer>
            <ion-toolbar color="dark">
                <ion-button color="danger" size="large" router-link="/">
                    Cancel
                </ion-button>
                <ion-button color="primary" size="large" router-link="/search_patient" slot="end" >
                    New Search
                </ion-button>
                <ion-button color="primary" size="large" :router-link="newPatientPageUrl" slot="end">
                    New Patient
                </ion-button>
                <ion-button v-if="isPersonSelected" color="success" size="large" :router-link="confirmationPageUrl" slot="end">
                    Continue
                </ion-button>
            </ion-toolbar>
        </ion-footer>
    </ion-page>    
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { man, woman } from 'ionicons/icons';
import {IonRow, IonLabel, IonPage, IonCol, IonContent, IonButton, IonFooter, IonToolbar, IonList, IonItem} from "@ionic/vue"
import { Patientservice } from "@/services/patient_service"
import { Patient } from "@/interfaces/patient"
import { Option } from "@/components/Forms/FieldInterface"
import ResultCard from "@/components/DataViews/HisResultCard.vue"

export default defineComponent({
    components: {ResultCard, IonLabel, IonRow, IonPage, IonFooter, IonContent, IonButton, IonCol, IonToolbar, IonList, IonItem},
    data:() => ({
        gname: '' as any,
        fname: '' as any,
        gender: '' as any,
        results: [],
        selectedPerson: {} as any,
        isPersonSelected: false,
        demographics: [
            { label: 'Patient ID', value: '-'},
            { label: 'Name', value: '-'},
            { label: 'Gender', value:'-'},
            { label: 'Birthdate', value: '-' },
            { label: 'Home District', value: '-'}, 
            { label: 'Home Village', value: '-' },
            { label: 'Current District', value: '-'},
            { label: 'Current T/A', value: '-'}
        ] as Array<Option>
    }),
    computed: {
        resultTitle(): string {
            return `${this.results.length} Result(s) found`
        },
        resultSubtitle(): string {
            return `Search term ${this.gname} ${this.fname}`
        },
        genderIcon(): any {
            return this.gender === 'M' ? man : woman
        },
        confirmationPageUrl(): string {
           return `/patients/confirm/${this.selectedPerson.getID()}` 
        },
        newPatientPageUrl(): string {
            const gender = this.gender === 'M' ? 'Male' : 'Female'
            return `/patient/registration?given_name=${this.gname}&family_name=${this.fname}&gender=${gender}`
        }
    },
    watch: {
        '$route': {
            async handler({query}: any) {
                this.gname = query.given_name
                this.fname = query.family_name
                this.gender = query.gender
                this.results = await this.fetchResults(this.gname, this.fname, this.gender)
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        async fetchResults(gname: string, fname: string, gender: string){
            const patients = await Patientservice.searchByName(gname, fname, gender)
            return patients.map((item: Patient) => {
                const patient = new Patientservice(item)
                return {
                    label: patient.getPatientInfoString(),
                    value: patient.getID(),
                    other: patient
                }
            })
        },
        onselect(person: any) {
            this.isPersonSelected = true
            this.selectedPerson = person
            this.showDetails(person)
        },
        showDetails(person: any) {
            this.demographics = [
                {
                    label: 'Patient ID',
                    value: person.getNationalID()
                },
                {
                    label: 'Name',
                    value: person.getFullName()
                },
                {
                    label: 'Gender',
                    value: person.getGender()
                },
                {
                    label: 'Birthdate',
                    value: person.getBirthdate()
                },
                {
                    label: 'Home District',
                    value: person.getHomeDistrict()
                },
                {
                    label: 'Home Village',
                    value: person.getHomeVillage()
                },
                {
                    label: 'Current District',
                    value: person.getCurrentDistrict()
                },
                {
                    label: 'Current T/A',
                    value: person.getCurrentTA()
                }
            ]
        }
    }
})
</script>
<style scoped>
    .large-card {
        border-radius: 15px;
        border: 1px solid #ccc;
        height: 70vh;
        background-color: rgb(255, 255, 255);
        overflow-y: scroll;
        -webkit-box-shadow: 0px -2px 19px -2px rgba(196,190,196,1);
        -moz-box-shadow: 0px -2px 19px -2px rgba(196,190,196,1);
        box-shadow: 0px -2px 19px -2px rgba(196,190,196,1);
    }
</style>
<template>
    <ion-page> 
        <ion-content> 
            <ion-row> 
                <ion-col> 
                    <his-select :options="getPatientOptions" :fdata="{}"> </his-select>
                </ion-col>
                <ion-col>
                    <!-- TODO: add patient demographics -->
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
                    Clear
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
export default defineComponent({
    components: { IonRow, IonPage, IonFooter, IonContent, IonButton, IonCol, IonToolbar, HisSelect},
    data:() => ({
        patientNames: [] as Array<Option>,
        results: {} as Array<Patient>,
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
                const patient = new Patientservice(item)
                return {
                    label: patient.getPatientInfoString(),
                    value: patient.getID()
                }
            })
        }
    }
})
</script>
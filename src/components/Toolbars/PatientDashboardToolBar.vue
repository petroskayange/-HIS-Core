<template>
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
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import InfoCard from "@/components/DataViews/DashboardSecondaryInfoCard.vue"
import IconCard from "@/components/DataViews/DashboardAppIcon.vue"
import { IonHeader, IonToolbar, IonCol, IonRow } from "@ionic/vue"
export default defineComponent({
    components: {IonHeader, IonToolbar, IonCol, IonRow, InfoCard, IconCard },
    props: {
       patientCardInfo: {
          type: Array,
          required: true,
       },
       programCardInfo: {
           type: Array,
           required: true
       },
       appIcon: {
           type: String,
           required: true
       }
    }
})
</script>

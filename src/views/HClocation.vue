<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Scan work-station location</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">HIS Core</ion-title>
        </ion-toolbar>
      </ion-header>
    
      <div id="container">
        <barcode-scan></barcode-scan>
      </div>
    </ion-content>

    <HisNavFooter></HisNavFooter>

  </ion-page>
</template>

<script lang="ts">
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import { defineComponent } from 'vue';
import BarcodeScan from '@/components/BarcodeScan.vue';
import HisNavFooter from "@/components/HisNavFooter.vue";

export default defineComponent({
  name: 'HC location',
  components: {
    HisNavFooter,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    "barcode-scan": BarcodeScan
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 150px;
  transform: translateY(-50%);
  background-color: #F0F0F0;
  border-style: solid;
  border-width: 1px;
  border-radius: 9px;
  height: 155px;
  margin: 20px;
}

</style>
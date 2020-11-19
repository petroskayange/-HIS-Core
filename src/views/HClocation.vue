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

    <ion-footer :translucent = "true" class="loc-footer">
      <ion-button class="footer-btns" color="danger">Cancel</ion-button>
    </ion-footer>

  </ion-page>
</template>

<script lang="ts">
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFooter, IonButton} from '@ionic/vue';
import { defineComponent } from 'vue';
import BarcodeScan from '@/components/BarcodeScan.vue';

export default defineComponent({
  name: 'HC location',
  components: {
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFooter,
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

.loc-footer {
    height: 100px !important;
    background-color: #333 !important;
}

.footer-btns {
    margin: 20px;
    height: 70px;
    width: 150px;
}
</style>
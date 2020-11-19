<template>
  <ion-footer>
    <ion-toolbar color="dark">
      <ion-button @click="cancel('redirectUrl')" color="danger">Cancel</ion-button>
      <ion-button @click="navigatePage('sectionId')" color="primary">Back</ion-button>
      <ion-button @click="navigatePage('sectionId')" color="primary">Next</ion-button>
      <ion-button @click="finish('destinationUrl')" color="success">Finish</ion-button>
    </ion-toolbar>
  </ion-footer>
</template>

<script>

import {IonButton, IonFooter, IonToolbar} from "@ionic/vue";

export default {
  name: "HisNavFooter",
  components: {
    IonButton,
    IonFooter,
    IonToolbar
  },
  methods: {
    cancel(redirectUrl) {
      console.log(redirectUrl);
    },
    navigatePage(sectionId) {
      console.log(sectionId);
    },
    finish(destinationUrl) {
      console.log(destinationUrl);
    }
  }
}
</script>

<style scoped>

</style>
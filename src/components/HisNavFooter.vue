<template>
  <ion-footer>
    <ion-toolbar color="dark">
      <ion-button @click="cancel('redirectUrl')" color="danger" size="large">Cancel</ion-button>
      <ion-button slot="end" @click="navigatePage('sectionId')" color="primary" size="large">Back</ion-button>
      <ion-button slot="end" @click="navigatePage('sectionId')" color="primary" size="large">Next</ion-button>
      <ion-button slot="end" @click="finish('destinationUrl')" color="success" size="large">Finish</ion-button>
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
      this.$router.push("/");
      console.log(destinationUrl);
    }
  }
}
</script>

<style scoped>

</style>
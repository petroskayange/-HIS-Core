<template>
  <ion-footer>
    <ion-toolbar color="dark">
      <ion-button @click="onCancel" color="danger" size="large">Cancel</ion-button>
      <ion-button slot="end" @click="onBack" color="primary" size="large">Back</ion-button>
      <ion-button slot="end" @click="onNext" color="primary" size="large">Next</ion-button>
      <ion-button slot="end" @click="onFinish" color="success" size="large">Finish</ion-button>
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
    onCancel() {
      this.$emit('onCancel')
    },
    onNext() {
      this.$emit('onNext')
    },
    onBack() {
      this.$emit('onBack')
    },
    onFinish() {
      this.$emit('onFinish')
    }
  }
}
</script>

<style scoped>

</style>
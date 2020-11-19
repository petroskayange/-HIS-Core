<template>
  <form novalidate>
    <ion-list class="get-centered">
      <ion-item>
        <ion-input
            name="first_name"
            type="text"
            spellcheck="false"
            autocapitalize="off"
            required
            placeholder="First Name"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
            name="last_name"
            type="text"
            spellcheck="false"
            autocapitalize="off"
            required
            placeholder="Last Name"
        ></ion-input>
      </ion-item>
    </ion-list>
  </form>
</template>

<script>
import {IonInput, IonItem, IonList} from "@ionic/vue";

export default {
  name: "HisForm",
  components: {
    IonInput,
    IonList,
    IonItem
  }
}
</script>

<style scoped>

</style>
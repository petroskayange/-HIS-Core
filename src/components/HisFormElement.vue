<template>
  <ion-list class="get-centered">
    <ion-item>
      <ion-input
          name="first_name"
          type="text"
          spellcheck="false"
          autocapitalize="off"
          required
          placeholder='{{ placeholder }}'
      ></ion-input>
    </ion-item>
  </ion-list>
</template>

<script>
import {IonInput, IonItem, IonList} from "@ionic/vue";

export default {
name: "HisFormElement",
  components: {
  IonList,
    IonInput,
    IonItem
  },
  props: {
    placeholder: {
      type: String
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <ion-list class="get-centered">
    <ion-item>
      <ion-input
          :name="elementName"
          :type="elementType"
          spellcheck="false"
          autocapitalize="off"
          required
          :placeholder="elementPlaceholder"
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
    elementName: {
      type: String,
      required: true
    },
    elementType: {
      type: String,
      required: true
    },
    elementPlaceholder: {
      type: String
    }
  }
}
</script>

<style scoped>

</style>
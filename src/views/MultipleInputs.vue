<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ labelValue }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container" class="main">
        <!-- Form -->
        <ion-row>
          <ion-col>
            <HisForm>
            </HisForm>
          </ion-col>
        </ion-row>
      </div>
    </ion-content>

    <HisNavFooter></HisNavFooter>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonRow, IonCol, IonHeader, IonToolbar, IonTitle} from '@ionic/vue';
import { defineComponent } from 'vue';
import HisNavFooter from "@/components/HisNavFooter.vue";
import HisForm from "@/components/HisForm.vue";

export default defineComponent({
  name: 'MultipleInputs',
  components: {
    HisForm,
    HisNavFooter,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonRow,
    IonCol,
    IonContent,
    IonPage
  },
  data() {
    return {
      labelValue: 'First Name'
    }
  }
});
</script>

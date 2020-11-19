<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{labelValue}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container" class="main">
        <!-- Form -->
        <ion-row>
          <ion-col>
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
                      name="first_name"
                      type="text"
                      spellcheck="false"
                      autocapitalize="off"
                      required
                      placeholder="First Name"
                  ></ion-input>
                </ion-item>
              </ion-list>
            </form>
          </ion-col>
        </ion-row>
      </div>
    </ion-content>

    <HisNavFooter></HisNavFooter>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonInput, IonList, IonRow, IonCol, IonItem, IonHeader, IonToolbar, IonTitle, IonFooter
} from '@ionic/vue';
import { defineComponent } from 'vue';
import HisNavFooter from "@/components/HisNavFooter.vue";

export default defineComponent({
  name: 'MultipleInputs',
  components: {
    HisNavFooter,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonRow,
    IonCol,
    IonItem,
    IonInput,
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

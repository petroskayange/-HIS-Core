<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Applications</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    
    <ion-row >
       <ion-col v-for="app, index in apps" :key="index" size="4">
        <application-card @click="setApplication(app)" :name="app.applicationName" :details="app.applicationDescription" :programID="app.programID" :iconURL="app.applicationIcon"></application-card>
       </ion-col>
     </ion-row>
  </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, modalController } from '@ionic/vue';
import { defineComponent } from 'vue';
import ApplicationCard from '@/components/ApplicationCard'
export default defineComponent({
  name: 'Modal',
  props: {
    title: { type: String, default: '' },
  },
  methods: {
    async getApps() {
        try {

            const response = await fetch('/config.json');

            if (response.status !== 200) {
                console.error(`Looks like there was a problem. Status Code: ${response.status}`);
                return { status: "error" };
            }
            const data = await response.json();
            this.apps = data.apps.filter(app => app.available === "true");

        } catch (err) {
            console.log('Fetch Error :-S', err);
            return { status: "error" };
        }
    },
    async setApplication(app) {
        await modalController.dismiss(
          {
            applicationIcon: app.applicationIcon,
            applicationName: app.applicationName,
            programID: app.programID
          }
        )
       
      },
  },
  mounted() {
    this.getApps();
  },
  data() {
    return {
      content: 'Content',
      apps: []
    }
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar, ApplicationCard, IonCol, IonRow}
});
</script>
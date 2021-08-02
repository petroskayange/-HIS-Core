<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Lab orders</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <div style="height: 90%; overflow: scroll;">

  <ion-grid>
  <ion-row>
    <ion-col  size="6">
      <div >
  <ion-list> 
      <ion-item
         v-for="data in testTypes" :key="data"
         @click="getSpecimens(data.name)"
      > 
        <ion-label> {{ data.name }} </ion-label>
        <ion-checkbox v-model="data.isChecked" slot="start"/>
      </ion-item>
    </ion-list>
      </div>
    </ion-col>
    <ion-col>
      <div style="">
      <ion-list> 
    <h3>Select specimen</h3>
      <ion-item
         v-for="data in specimens" :key="data"
        :detail="true"
      > 
        <!-- :color="isActive(item) ? 'primary' : ''" -->
        {{ data.name }}
      </ion-item>
    </ion-list>
    <h3>Main test(s) reason</h3>
        <p v-for="data in specimens" :key="data">
          {{data.name}}
        </p>
      </div>
     <div style="">
<ion-item
         v-for="data in reasons" :key="data"
      > 
        <!-- :color="isActive(item) ? 'primary' : ''" -->
        {{ data }}
      </ion-item>
      </div>
       <div style="height: 30%">

      </div>
    </ion-col>
  </ion-row>
</ion-grid> 
    </div>
  <ion-footer>
    <ion-toolbar> 
      <ion-button @click="closeModal" slot="end"> Place orders </ion-button>
      <ion-button @click="closeModal" slot="start" color="danger"> Close </ion-button>
    </ion-toolbar>
  </ion-footer>
  </ion-content>
</template>
<script lang="ts">
import {
  IonContent,
  IonButton,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  modalController,
  IonList,
  IonItem,
  IonCheckbox,
} from "@ionic/vue";
import { defineComponent, PropType } from "vue";
import { toastWarning } from "@/utils/Alerts"
import ApiClient from "@/services/api_client";
import { ActivityInterface } from "@/apps/interfaces/AppInterface"
import { OrderService } from "@/services/order_service";

export default defineComponent({
  name: "Modal",
  props: {
    activities: {
      type: Object as PropType<ActivityInterface[]>,
      required: true
    },
    title: {
      type: String, 
      default: ""
    },
  },
  watch: {
    activities: {
      handler(activities: Array<ActivityInterface>){
        if (activities) {
          this.appActivities = [...activities]
          this.getActivities();
        }
      },
      immediate: true
    }
  },
  methods: {
    async getActivities() {
     this.testTypes = await OrderService.getTestTypes();
    },
    async getSpecimens(testName: string) {
     this.specimens = await OrderService.getSpecimens(testName);
    },
    async postActivities() {
      const userActivities = {
        property: "activities",
        'property_value': this.selectedActivities,
      };
      const response = await ApiClient.post(`/user_properties`, userActivities);

      if (!response || response.status !== 201) {
        toastWarning("Could not save activities");
        //
      } else {
        await modalController.dismiss();
      }
    },
    async closeModal() {
      await modalController.dismiss({})
    },
  },
  computed: {
    selectedActivities(): string {
      return this.appActivities
        .filter((element) => element.selected == true)
        .map((el) => el.value )
        .join(",");
    }
  },
  mounted() {
    this.getActivities();
  },
  data() {
    return {
      content: "Content",
      appActivities: [] as Array<ActivityInterface>,
      testTypes: [],
      specimens: [],
      reasons: ['Routine', 'Targeted', 'Confirmatory', 'Stat', 'Repeat / Missing']
    };
  },
  components: {
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonList,
    IonItem,
    IonCheckbox,
  },
});
</script>
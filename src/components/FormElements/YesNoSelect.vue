<template>
  <div>
    <view-port :showFull="false">
      <ion-grid>
          <ion-row button v-for="(item, index) in filtered" :key="index" @click="onselect(item)"> 
          <ion-col size="6">
            <h1>{{item.label}}</h1>
          </ion-col>
          <ion-col size="6">
            <ion-segment
              mode="ios"
              @ionChange="segmentChanged($event)"
              v-model="entry.isChecked"
            >
              <ion-segment-button value="sunny" class="yes-no">
                <ion-label>Yes</ion-label>
              </ion-segment-button>
              <ion-segment-button value="rainy">
                <ion-label>No</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-col>
        </ion-row>
      </ion-grid>
    </view-port>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Option } from "../Forms/FieldInterface";
import SelectMixin from "@/components/FormElements/SelectMixin.vue";
import {
  IonRow,
  IonGrid,
  IonLabel,
  IonPage,
  IonCol,
  IonContent,
  IonButton,
  IonFooter,
  IonToolbar,
  IonList,
  IonItem,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
export default defineComponent({
  components: {
    IonRow,
    IonGrid,
    IonLabel,
    IonCol,
    IonSegmentButton,
    IonSegment,
  },
  name: "HisSelect",
  mixins: [SelectMixin],
  watch: {
    clear(val: boolean) {
      if (val) this.clearSelection();
    },
  },
  data() {
    return {
      values: {},
    };
  },
  async activated() {
    this.listData = await this.options(this.fdata);
  },
  async mounted() {
    this.listData = await this.options(this.fdata);
    if (this.preset) {
      this.onselect(this.preset);
    }
  },
  methods: {
    onselect(item: Option): void {
      this.selected = item.label;
      this.$emit("onValue", item);
    },
    segmentChanged(ev: CustomEvent) {
      console.log("Segment changed", ev);
    },
  },
});
</script>
<style scoped>
ion-segment-button {
  height: 50px;
  margin: 1%;
  font-size: 30px;
  --indicator-color: #028000;
  --border-color: red;
  --background: white;
}

.segment-button-checked {
  color: white;
}
</style>
<template>
  <div>
    <view-port :showFull="true">
      <ion-grid>
        <ion-row >
          <ion-col :size="getSize" v-for="(item, index) in listData" :key="index">
            <ion-grid>
            <ion-row>
  <ion-col size="6">
            <h1>{{ item.label }}</h1>
          </ion-col>
          <ion-col size="6">
            <ion-segment
              mode="ios"
              v-model="item.value"
            >

              <ion-segment-button
                class="yes-no"
                v-for="(option, idx) in item.other.values"
                :key="idx"
                :value="option.value"
              >
                <ion-label>{{ option.label }}</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-col>

            </ion-row>
            </ion-grid>
        
          </ion-col>
        </ion-row>
      </ion-grid>
    </view-port>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import SelectMixin from "@/components/FormElements/SelectMixin.vue";
import {
  IonRow,
  IonGrid,
  IonLabel,
  IonCol,
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
  name: "HisMultiYesNo",
  mixins: [SelectMixin],
  watch: {
    clear(val: boolean) {
      if (val) this.clearSelection();
    },
    listData: {
      async handler( params ) {
        this.$emit("onValue",params);
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    getSize(): string {
      return this.listData.length > 6 ? '6' : '12'
    }
  },
  data() {
    return {
      values: {} as any,
    };
  },
  async activated() {
    this.listData = await this.options(this.fdata);
  },
  async mounted() {
    this.listData = await this.options(this.fdata);
    await this.listData.forEach((element: any) => {
      this.values[element.property] = "";
    });
  },
  methods: {
    onselect(data: any): void {
      this.$emit("onValue", this.listData);
    },
   
  },
});
</script>
<style scoped>
ion-segment-button {
  height: 50px;
  margin: 1%;
  font-size: 1.6em;
  --indicator-color: #028000;
  --background: white;
}

.segment-button-checked {
  color: white;
}
</style>
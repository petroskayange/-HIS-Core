<template>
  <view-port>
    <div class="view-port-content">
      <ion-grid style="width: 100%">
        <ion-row>
          <ion-col size="2">
            <ion-button
              v-for="(key, index) in keys"
              :key="key.name"
              @click="activeField = index"
              class="vitals-btn"
              size="large"
              expan="full"
              :color="activeField === index ? 'secondary' : 'tertiary'"
            >
              <ion-avatar>
                <img :src="img(key.icon)" />
              </ion-avatar>
              <ion-label>{{ key.name }}</ion-label>
            </ion-button>
          </ion-col>
          <ion-col size="5">
            <ion-input type="text" v-model="keys[activeField].value" />
            <base-keyboard
              btnSize="96px"
              :layout="keyboard"
              :onKeyPress="onKeyPress"
            />
          </ion-col>
          <ion-col size="5">
            <table class="his-table">
              <tr v-for="(key, index) in keys" :key="key.name" 
                :style="activeField === index ? {color : 'red'}: ''">
                <td>{{ key.name }}</td>
                <td>{{ key.value }}</td>
                <td>{{ key.modifier }}</td>
              </tr>
              <tr>
                <td>Age</td>
                <td>{{age}}</td>
                <td>Years old</td>
              </tr>
              <tr>
                <td colspan="2">BMI</td>
                <td>{{ BMI.index }}</td>
              </tr>
              <tr>
                <td colspan="3" :style="{'background-color': BMI.color, 'color': 'white'}">{{ BMI.result }}</td>
              </tr>
            </table>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </view-port>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import ViewPort from "../DataViews/ViewPort.vue";
import {
  IonGrid,
  IonCol,
  IonRow,
  IonInput,
  IonButton,
  IonAvatar,
} from "@ionic/vue";
import BaseKeyboard from "@/components/Keyboard/BaseKeyboard.vue";
import { VITALS_KEYPAD } from "../Keyboard/KbLayouts";
import { BMIService } from "@/services/bmi_service";
import { Patient } from "@/interfaces/patient";
import { ProgramService } from "@/services/program_service";
import { Patientservice } from "@/services/patient_service";
export default defineComponent({
  components: {
    ViewPort,
    IonGrid,
    IonCol,
    IonRow,
    IonInput,
    BaseKeyboard,
    IonButton,
    IonAvatar,
  },
  props: {
    fdata: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    options: {
      type: Function,
      required: true,
    },
    clear: {
      type: Boolean,
    },
  },
  data: () => ({
    listData: [] as any,
    keys: [
      { name: "Weight", value: "", modifier: "KG", icon: "weight" },
      { name: "Height", value: "", modifier: "CM", icon: "height" },
      { name: "BP", value: "", modifier: "mmHG", icon: "bp" },
      { name: "Temp", value: "", modifier: "C", icon: "temp" },
      { name: "SP02", value: "", modifier: "%", icon: "spo2" },
      { name: "Pulse", value: "", modifier: "BPM", icon: "pulse-rate" },
    ],
    patientID: '' as any,
    activeField: 0,
    keyboard: VITALS_KEYPAD,
    age: null as any,
    gender: null as any,
    BMI: {
      index: 0,
      result: 'Normal',
      color: ''
    }
  }),
  watch: {
    $route: {
      async handler({ query }: any) {
          const response: Patient = await ProgramService.getJson(
            `/patients/${query.patient_id}`
          );
          this.patientID = query.patient_id;
          const patient = new Patientservice(response);
          this.age = patient.getAge();
          this.gender = patient.getGender();
          patient.getRecentWeight
          
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    img(name: string) {
      return `assets/images/vitals/${name}.png`;
    },
    async getBMI(): Promise<any> {
      const j: any= await BMIService.getBMI(this.getWeight(), this.getHeight(), this.gender, this.age);
      this.BMI.index = j.index;
      this.BMI.result = j.result;
      this.BMI.color = j.color;
     
    },
    async onKeyPress(key: any) {
      const currentValue = this.keys[this.activeField].value;
      if (key.match(/del/i)) {
        this.keys[this.activeField].value = currentValue.substring(
          0,
          currentValue.length - 1
        );
      } else if (key.match(/clear/i)) {
        this.keys[this.activeField].value = "";
      } else {
        this.keys[this.activeField].value += key;
      }
      this.getBMI();
    },
    getWeight(): number {
      const weight = this.keys.filter((key) => key.name === "Weight");
      return weight[0].value === "" ? 0 : parseFloat(weight[0].value);
    },
    getHeight(): number {
      const height = this.keys.filter((key) => key.name === "Height");
      return height[0].value === "" ? 0 : parseFloat(height[0].value);
    },
  },
});
</script>
<style scoped>
.ico {
  width: 60px;
}
.view-port-content {
  height: 100%;
  background: white;
}
.key-b {
  position: relative;
}
.keypad {
  background: #f4f4f4;
  padding: 0.7em;
  margin: auto;
}
.his-keyboard-margin {
  padding: 0px !important;
}

.his-keyboard-btn {
  width: 110px !important;
}
.his-keyboard {
  width: 100% !important;
}
.keypad-input {
  border: solid 1px #ccc;
  background: white;
  border-radius: 10px;
  width: 100%;
  height: 70px;
  text-align: center;
  font-size: 3em;
}
ion-input {
  border: solid 1px black;
  font-size: 20px;
}
.active {
  color: blue;
}
.vitals-btn{
  width: 100%;
  height: 15%;
}
</style>
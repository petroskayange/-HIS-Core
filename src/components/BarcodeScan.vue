<template>
  <div id="barcode-container">
      <ion-grid fixed="true" class="main-table">
        <ion-row>
            <!--ion-col class="ion-align-items-center" size="12" size-md="3"-->
            <ion-col size="12" size-md="2">
                <ion-img id="barcode-img" src="/assets/images/barcode.png"></ion-img>
            </ion-col>
            <ion-col size-md="10" size="12">
                <ion-input type="text" id="barcode-inputbox" 
                 :autofocus="true" ref="barcodeInputbox" v-on:input="checkForBarcode"></ion-input>
            </ion-col>
        </ion-row>
      </ion-grid>

  </div>
</template>

<script lang="ts">
//import { IonInput } from '@ionic/vue';
import { defineComponent } from 'vue';
import {IonCol, IonGrid, IonImg, IonInput, IonRow} from "@ionic/vue";

export default defineComponent({
  name: 'BarcodeScan',
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonImg
  },
  methods: {
      setInputFocus(){
      //const inp = await this.$refs.barcodeInputbox.getInputElement();
      },
    async checkForBarcode() {
      // const barcodeEntered = await this.barcodeInputbox.getInputElement();
      // if (barcodeEntered.value.match(/.+\$$/i) != null) {
      //   alert("Found $ sign");
      // }
    },
      loadAttributes() {
        console.log("aaa")
      }
  } ,
  mounted(){
    this.setInputFocus();
  }
});
</script>

<style scoped>
#barcode-inputbox {
    position: fixed;
    bottom: 35px;
    font-weight: bold;
    font-size: 58px;
    margin-bottom: 15px;
    border-style: solid;
    border-width: 0px 0px 2px 0px;
    width: 80%;
    border-color: black;
    text-align: left;
    background-color: white;
}

#barcode-container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  padding: 5px;
  top: 75px;
}

.main-table {
  width: 100% !important;
}

#barcode-img {
  height: 140px;
  width: 140px;
}

</style>
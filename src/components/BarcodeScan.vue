<template>
  <div id="barcode-container">
      <ion-grid class="main-table">
        <ion-row class="inputs-container">
            <!--ion-col class="ion-align-items-center" size="12" size-md="3"-->
            <ion-col  class="img-container">
                <img id="barcode-img" src="/assets/images/barcode.png" />
            </ion-col>
            <ion-col size-md="10">
                  <ion-input autofocus="true" id="barcode-inputbox" v-model="barcodeText"></ion-input>
            </ion-col>
        </ion-row>
      </ion-grid>

  </div>
</template>

<script>
import { toastController } from '@ionic/vue';
import { defineComponent } from 'vue';
import {IonCol, IonGrid, IonImg, IonInput, IonRow} from "@ionic/vue";
import ApiClient from "@/services/api_client"

export default defineComponent({
  name: 'BarcodeScan',
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonInput
  },
  data() {
    return {
      barcodeText: ''
    }
  },
  methods: {
      checkForbarcode(){
        if(this.barcodeText.match(/.+\$$/i) != null){
          this.barcodeText = this.barcodeText.replace(/\$/ig, '');
          this.scanLocation();
        }
      },
      async scanLocation() {
        const response = await ApiClient.get("locations/" + this.barcodeText, {}, {});
        if (!response || response.status !== 200) {
          this.showMessage("Invalid location")
        }else {
          const data = await response.json();
          sessionStorage.userLocation = data.name;
          this.$router.push("/");
        }
      },
      loadAttributes() {
        console.log("aaa");
      }, async showMessage(message) {
       const toast = await toastController
        .create({
          message: message,
          position: 'top',
          animated: true,
          duration: 2000
        })
      return toast.present();
    }
  } ,
  watch: {
    barcodeText: function() {
      this.checkForbarcode();
    }
  }
});
</script>

<style scoped>
#barcode-inputbox {
    position:inherit;
    font-weight: bold;
    font-size: 1.9em;
    border-style: solid;
    border-width: 0px 0px 2px 0px;
    border-color: black;
    text-align: left;
    background-color: white;
    margin: 3% 0% 5% 0%;
    height: 60%;
    width: 99%;
}

#barcode-img {
  height: 75%;
  width: 85%;
  margin-top: 10%;
}

 @media only screen and (max-width: 900px) {
   #barcode-inputbox {
     margin: 10% 0% 5% -35%;
     height: 75%;
     width: 138%;
   }

   .img-container {
     /*display: none !important;*/
     width: 20%;
     height: 40%;
   }

   #barcode-img {
      max-height: 50%;
      max-width: 70%;
      margin-top: 5%;
      margin-left: -40%;
   }
 }

#barcode-container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  padding: 5px;
  top: 50%;
}

.main-table {
  width: 100% !important;
}

</style>
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{helpText}}</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">HIS Core</ion-title>
        </ion-toolbar>
      </ion-header>
    
      <div id="container">
        <div id="page0" class="content-containers">
            <input-text :passedKey="passedKey"></input-text>
            <input-text-keyboard :onKeyPress="keyPressed"></input-text-keyboard>
        </div>

        <div id="page1" class="content-containers">
            <input-text :passedKey="passedKey"></input-text>
            <input-text-keyboard :onKeyPress="keyPressed"></input-text-keyboard>
        </div>

      </div>
    </ion-content>

    <ion-footer :translucent = "true" class="loc-footer">
      <ion-button class="footer-btns" color="danger">Cancel</ion-button>
      <ion-button class="footer-btns" @click="goNextPage" id ="nextButton" color="success">Next</ion-button>
      <ion-button class="footer-btns" @click="goBack" id="backButton" color="primary">Back</ion-button>
    </ion-footer>

  </ion-page>
</template>

<script>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFooter } from '@ionic/vue';
import { defineComponent } from 'vue';
import inputTextSearchResults from '@/components/inputTextSearchResults.vue';
import inputTextKeyboard from '@/components/inputTextKeyboard.vue';

export default defineComponent({
  name: 'Client search',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFooter,
    "input-text": inputTextSearchResults,
    "input-text-keyboard": inputTextKeyboard
  },
  data() {
      return {
          helpText: "First Name",
          passedKey: '',
          containers: [],
          pageCount: 0,
          helpTexts: ['First Name','Last Name']
      }
  },
  methods: {
    keyPressed(key){
      this.passedKey = key;
    },
    goNextPage(){
      const divs = this.containers;
      for(let i = 0; i < divs.length; i++){
        divs[i].setAttribute("style", "visibility: hidden;")
      }
      this.pageCount += 1;
      let div = document.getElementById("page" + this.pageCount);
      const backButton = document.getElementById("backButton");
      const nextButton = document.getElementById("nextButton");

      if(div == undefined){
        this.pageCount -= 1;
        div = document.getElementById("page" + this.pageCount);
      }else{
        backButton.setAttribute("style","display: inline;");  
      }

      if((this.pageCount + 1) == this.helpTexts.length){
        nextButton.innerHTML = 'Finish';
      }else{
        nextButton.innerHTML = 'Next';
      }

      div.setAttribute("style", "visibility: visible;")
      this.helpText = this.helpTexts[this.pageCount];
    },
    goBack(){
      const divs = this.containers;
      for(let i = 0; i < divs.length; i++){
        divs[i].setAttribute("style", "visibility: hidden;")
      }
      this.pageCount -= 1;
      let div = document.getElementById("page" + this.pageCount);
      const backButton = document.getElementById("backButton");
      const nextButton = document.getElementById("nextButton");

      if(div == undefined){
        this.pageCount += 1;
        div = document.getElementById("page" + this.pageCount);
      }else{
        backButton.setAttribute("style","display: none;");  
        nextButton.innerHTML = 'Next';
      }

      if(this.pageCount == 0){
        backButton.setAttribute("style","display: none;");  
        nextButton.innerHTML = 'Next';
      }

      div.setAttribute("style", "visibility: visible;")
      this.helpText = this.helpTexts[this.pageCount];
    }
  },
  mounted(){
   //sasas
   const containers = document.getElementsByClassName("content-containers");
   for(let i = 0; i < containers.length; i++){
     this.containers.push(containers[i]);
   }
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 45%;
  transform: translateY(-50%);
  /*background-color: #F0F0F0;
  border-style: solid;
  border-width: 1px;*/
  border-radius: 9px;
  height: 75%;
  margin: 2%;
}

.loc-footer {
    height: 10% !important;
    background-color: #333 !important;
}

.footer-btns {
  margin-left: 1%;
  margin-top: 1%;
  height: 8vh;
}

 @media only screen and (max-width: 900px) {
   #container {
     top: 20%;
     height: 15%;
   }
 }

 #nextButton {
     float: right;
     margin-right: 5px;
 }

 #backButton {
     float: right;
     margin-right: 5px;
     display: none;
 }

.content-containers {
  visibility: hidden;
  top: 1%;
  position: inherit;
  width: 100%;
}

#page0 {
  visibility: visible;
}

</style>
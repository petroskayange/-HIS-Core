<template>
  <ion-page>
    <ion-header :translucent="true">
        <ion-toolbar>
      <ion-row >
      <ion-col size="0.5" >
          <ion-icon :icon="barcode" size="large" style="height: 100%;"></ion-icon>
      </ion-col>
      <ion-col size="3.5" class="outlined">
          <ion-input autofocus="true"></ion-input>
      </ion-col>
      <ion-col size="5">
        facility details
      </ion-col>
      <ion-col size="3">
        application version
      </ion-col>
    </ion-row>
    </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      

      <div id="container">
        <p>Home content</p>
      </div>
    </ion-content>
   

  <ion-footer>
    <ion-toolbar>
       <ion-button color="danger left" size="large" router-link="/login">Logout</ion-button>
        <ion-button color="primary" size="large">Applications</ion-button>
        <ion-button color="success" size="large">Find or Register</ion-button>
        <ion-button color="primary" size="large">Find By</ion-button>
    </ion-toolbar>
  </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonFooter, IonPage, IonTabs, IonTabBar,IonTabButton, IonTitle, IonToolbar, IonIcon,  IonInput, IonRow, IonCol, IonItem,
  IonText, IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';
import { barcode } from 'ionicons/icons';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonIcon,
    IonInput,
    IonRow,
    IonCol,
    IonButton,
    IonFooter
  },
  setup() {
    return {
      barcode
    }
  }
});
</script>

<style scoped>
ion-button {
    float: right;
  }
  .left {
    float: left;
  }
  .outlined{
    border: solid 1px grey;
  }
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
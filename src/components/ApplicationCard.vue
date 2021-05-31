<template >
 <ion-card >
        <ion-thumbnail v-if="iconURL !== ''" class="ion-justify-content-center">
        <ion-img :src="iconURL"></ion-img>
      </ion-thumbnail> 
        <ion-card-header>
          <ion-card-subtitle>{{name}}</ion-card-subtitle>
          <ion-card-title></ion-card-title>
        </ion-card-header>
        <ion-card-content>
        {{details}}
        </ion-card-content>
      </ion-card> 
</template>

<script>
import { IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonImg, IonThumbnail } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
    props: ['name', 'details', 'programID', 'iconURL'],
  components: { IonCard, IonCardContent, IonCardSubtitle, IonCardTitle,  IonCardHeader, IonImg, IonThumbnail},
  setup() {
    return {  };
  },
  methods: {
      
    getImgUrl(url) {
        '@'
        return require(`@/assets ${url}`);
    }
  }
});
</script>
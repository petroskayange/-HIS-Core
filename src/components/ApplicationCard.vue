<template >
 <ion-card >
        <img src="../../public/assets/images/aids.png"/>
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
import { IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
    props: ['name', 'details', 'programID', 'iconURL'],
  components: { IonCard, IonCardContent, IonCardSubtitle, IonCardTitle,  IonCardHeader},
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
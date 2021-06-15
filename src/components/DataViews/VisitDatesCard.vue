<template>
    <div class="card"> 
        <h4> <center> {{title}} </center> </h4>
        <div v-for="(item, index) in items" :key="index"> 
            <ion-card color="light" :style="{padding:'3%', fontWeight: 'bold', marginBottom: '10%'}"> 
               <ion-card-title><center> {{item.label}} </center></ion-card-title>
            </ion-card>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Option } from "@/components/Forms/FieldInterface"
import { IonCard, IonCardTitle } from "@ionic/vue"

export default defineComponent({
    components: { IonCard, IonCardTitle },
    props: {
        title: {
            type: String,
            default: () => 'Visits'
        },
        items: {
            type: Object as PropType<Option[]>,
            required: true
        }
    }
})
</script>
<style scoped>
.card{
  padding: 1%;
  border-radius: 6px;
  border: 1px solid #ccc;
  height: 70vh;
  background-color: rgb(255, 255, 255);
  overflow: hidden;
  -webkit-box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
  -moz-box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
  box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
}
</style>

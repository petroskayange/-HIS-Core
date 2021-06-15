<template>
    <div class="card"> 
        <h4> <center> {{title}} </center> </h4>
        <div v-for="(item, index) in items" :key="index"> 
            <center><ion-button color="light" class="btn"> {{item.label}} </ion-button></center>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Option } from "@/components/Forms/FieldInterface"
import { IonButton } from "@ionic/vue"

export default defineComponent({
    components: { IonButton },
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
.btn {
    width: 90%;
    text-align: center;
    font-weight: bold;
    margin-bottom: 20px;
}
.card{
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

<template>
    <div class="card"> 
        <div class="title-card" :style="{backgroundColor: titleColor}"> {{title}} </div>
        <ion-list>
            <ion-item v-for="(item, index) in items" :key="index">
                <ion-label> {{ item.label }} </ion-label>
                <ion-label slot="end"> {{ item.value }} </ion-label>
            </ion-item>
        </ion-list>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IonLabel, IonList, IonItem } from "@ionic/vue";
import { Option } from "@/components/Forms/FieldInterface"

export default defineComponent({
    components: {IonLabel, IonList, IonItem},
    props: {
        title: {
            type: String,
            required: true
        },
        items: {
            type: Object as PropType<Option[]>
        },
        titleColor: {
            type: String,
            required: false,
            default: () => '#337ab7'
        }
    }
})
</script>
<style scoped>
.card {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #ccc;
  height: 34vh;
  background-color: rgb(255, 255, 255);
  overflow: hidden;
  -webkit-box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
  -moz-box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
  box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);  
}
.title-card {
    padding: 8px;
    width: 100%;
    color: white;
}
</style>
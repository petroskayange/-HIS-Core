<template>
    <div> 
        <ion-list>
            <ion-item button v-for="(item, index) in options" :key="index" @click="onselect(item)"> 
                <ion-label> {{item.label}} </ion-label>
            </ion-item>
        </ion-list>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {  Option } from '../Forms/FieldType'
import { IonList, IonItem, IonLabel} from "@ionic/vue"

export default defineComponent({
    name: "HisSelect",
    components: {
        IonList, IonItem, IonLabel
    },
    props: {
        options: {
            required: true,
            type: Object as PropType<Option[]> 
        }
    },
    methods: {
        onselect(item: Option): void {
            this.$emit('onValue', item)
        }
    }
})
</script>
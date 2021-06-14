<template>
    <ion-card>
        <ion-card-header>
            <ion-card-title> {{title}} </ion-card-title>
            <ion-card-subtitle>
                <ion-icon :icon="icon" size="medium"></ion-icon> 
                {{ subtitle }} 
            </ion-card-subtitle>
        </ion-card-header>
    </ion-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonCard, IonIcon, IonCardTitle, IonCardSubtitle, IonCardHeader } from "@ionic/vue"
export default defineComponent({
    name: "HisResultCard",
    components: {IonCard, IonIcon, IonCardTitle, IonCardSubtitle, IonCardHeader},
    props: {
        title: {
            required: true,
            type: String
        },
        subtitle: {
            required: true,
            type: String
        },
        icon: {
            required: false
        }
    }
})
</script>

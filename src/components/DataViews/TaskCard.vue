<template>
    <ion-card> 
        <ion-row> 
            <ion-col size="4">
                <ion-thumbnail> 
                    <img :src="icon">
                </ion-thumbnail>
            </ion-col>
            <ion-col size="8"> 
                <ion-label>{{ title }}</ion-label> <br/>
                <ion-label> {{ description }} </ion-label>
            </ion-col>
        </ion-row>
    </ion-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        title: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        }
    }
})
</script>

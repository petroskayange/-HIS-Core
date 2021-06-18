<template>
    <ion-card class="task-card"> 
        <ion-row> 
            <ion-col size="4">
                <ion-thumbnail> 
                    <img :src="icon">
                </ion-thumbnail>
            </ion-col>
            <ion-col size="8"> 
                <ion-label>{{ title }}</ion-label> <br/>
                <ion-card-subtitle> {{ description }} </ion-card-subtitle>
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
<style scoped>
    .task-card {
        font-weight: bold;
        height: 70px;
        overflow: hidden;
    }
</style>

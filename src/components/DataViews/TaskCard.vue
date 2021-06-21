<template>
    <ion-card class="task-card">
        <ion-item lines="none"> 
            <ion-thumbnail> 
                <ion-img :src="icon"/> 
            </ion-thumbnail>
            <ion-label> 
                {{ title }}
                <br/>
                <small>{{ description }}</small> 
            </ion-label> 
        </ion-item>
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
    .task-card:active {
        transform: translateY(4px);
    }
</style>

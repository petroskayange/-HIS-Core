<template>
    <ion-card class="his-card task-card clickable">
        <ion-item>
            <ion-thumbnail slot="start">
                <img :src="icon"/>
            </ion-thumbnail>
            <ion-label class="title">{{title}}</ion-label>
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
    .title {
        font-size: 0.8em;
        font-weight: bold;
    }
    .task-card {
        padding: 0;
        margin: 0;
        height: 70px;
        overflow: hidden;
    }
</style>

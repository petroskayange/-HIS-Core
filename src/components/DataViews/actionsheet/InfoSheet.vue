<template>
    <div class="info-content"> 
        <h3 class='title'> 
            {{ title }} 
        </h3>
        <p class='description' v-html="description"> </p> 
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    props: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }
})
</script>
<style scoped>
    .title {
        color: green;
    }
    .info-content {
        margin: auto;
        padding: 80px 0;
        text-align: center;
    }
    .description {
        font-size: 1.3em;
        padding: 10px;
    }
</style>

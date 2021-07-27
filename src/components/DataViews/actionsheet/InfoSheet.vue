<template>
    <div class="info-content"> 
        <h3 class='title'> 
            {{ title }} 
        </h3>
        <p class='description'> 
            {{ description }} 
        </p>
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
        text-align: center;
    }
    .info-content {
       padding: 80px 0;
    }
    .description {
        font-size: 1.3em;
        text-align: center;
        padding: 10px;
    }
</style>

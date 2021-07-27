<template>
    <ul> 
        <li v-for="(item, index) in items" :key="index">
            {{ item }}
        </li>
    </ul>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    props: {
        items: {
            type: Array,
            required: true
        }
    }
})
</script>
<style scoped>
    ul li {
        font-weight: bold;
        margin: 5%;

    }
</style>

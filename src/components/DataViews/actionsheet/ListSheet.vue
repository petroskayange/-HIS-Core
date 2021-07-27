<template>
    <ul> 
        <li v-for="(item, index) in items" :key="index">
           <span v-html="item"> </span>
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
        margin: 5%;
    }
</style>

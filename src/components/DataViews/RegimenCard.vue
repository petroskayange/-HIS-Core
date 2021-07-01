<template>
    <div :class="`his-card clickable ${color}`" @click="$emit('onclick')"> 
        <b>{{ value }}</b> {{ label }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    color: {
        type: String
    },
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
  }  
})
</script>
<style scoped>
 .his-card {
    height: 50px;
    margin: 1.4%;
    text-align: center;
 }
</style>

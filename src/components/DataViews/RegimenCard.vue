<template>
    <div :class="`his-card clickable ${color}`" @click="$emit('onclick')"> 
        <div v-show="showTitle"> 
            <b>{{ value }}</b>
        </div>
        <div> 
            {{ label }}
        </div>
        <div> 
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    showTitle: {
        type: Boolean,
        default: true
    },
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
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 50px;
    margin: 1.4%;
 }

</style>

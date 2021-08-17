<template>
    <div :class="`his-card ${state} clickable`">
        <img :src="icon"/> 
        <center> {{ label }} </center>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props : {
        label: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        state(): string {
            return this.isActive ? 'active-card-color' : 'disabled-card-color'
        },
        icon(): string {
            return `assets/images/${this.image}.png`;
        }
    }
})
</script>
<style scoped>
    img {
        width: 40px;
        height: 40px;
    }
    .his-card {
        color: black;
        margin: 10px;
        text-align: center;
        font-weight: bold;
    }
</style>
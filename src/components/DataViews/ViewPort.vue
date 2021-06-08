<template> 
    <div id='view-port' :style="{maxHeight: `${height}px`}"> 
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    props: {
        height: {
            type: Number,
            default: () => 589
        }
    }
})
</script>
<style scoped>
    #view-port {
        border: 1px solid black;
        margin-left: 25px;
        background: #F0F0F0;
        width: 96.5%;
        border-radius: 10px;
        padding: 5px;
        overflow-x: scroll;
    }
</style>
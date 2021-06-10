<template> 
    <div id='view-port' :class="showFull ? 'full': 'half'"> 
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'ViewPort',
    props: {
        showFull: {
            type: Boolean,
            default: () => true
        }
    }
})
</script>
<style scoped>
    #view-port {
        border: 2px solid #ccc;
        background: #F0F0F0;
        width: 100%;
        border-radius: 10px;
        padding: 5px;
    }
    .full {
        max-height: 100%;
    }
    .half {
        max-height: 350px;
        overflow-x: scroll;
    }
</style>
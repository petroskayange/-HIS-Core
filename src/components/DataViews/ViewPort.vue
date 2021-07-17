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
        border: 1px solid #ccc;
        background: #f8f8f8;
        width: 95%;
        margin: auto;
        margin-top: 1.7%;
        border-radius: 3px;
        padding: 5px;
        overflow: hidden;
      -webkit-box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
      -moz-box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
      box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
    }
    .full {
        height: 80vh;
    }
    .half {
        height: 50vh;
    }
</style>
<template>
  <div id="card">
    <slot> </slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ToolBarMediumCard"
});
</script>
<style scoped>
    #card {
      border: 1px solid #ccc;
      border-radius: 15px;
      padding: 0px;
      height: 90px;
      font-size: 0.8em;
      overflow: hidden;
      -webkit-box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
      -moz-box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
      box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
    }
</style>
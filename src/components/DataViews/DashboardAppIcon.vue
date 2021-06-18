<template>
  <div id="card">
    <ion-img v-if="icon" :src="icon" id="logo"></ion-img>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "AppIcon",
  props: {
    icon: {
      type: String,
      required: true
    }
  }
});
</script>
<style scoped>
    #logo {
      object-fit: contain;
      margin: auto;
      width: 80%;
    }
    #card {
      border: 1px solid #ccc;
      border-radius: 15px;
      height: 110px;
      overflow: hidden;
-webkit-box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
-moz-box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
    }
</style>
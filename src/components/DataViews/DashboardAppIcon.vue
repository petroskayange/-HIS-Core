<template>
  <div id="card">
    <ion-img :src="icon" id="logo"></ion-img>
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
      margin: auto;
      width: 140px;
      margin-top: 5%;
    }
    #card {
      border: 2px solid #ccc;
      height: 128px;
      overflow: hidden;
     -webkit-box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.1);
      -moz-box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.1);
      box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.1);
    }
</style>
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
      border: 1px solid #ccc;
      height: 128px;
      overflow: hidden;
      -webkit-box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
      -moz-box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
      box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
    }
</style>
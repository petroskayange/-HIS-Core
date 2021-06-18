<template>
  <tool-bar-medium-card>
    <ion-img v-if="icon" :src="icon" id="logo"></ion-img>
  </tool-bar-medium-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ToolBarMediumCard from "@/components/Cards/ToolbarMediumCard.vue"
export default defineComponent({
  name: "AppIcon",
  components: {ToolBarMediumCard},
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
    margin-top: 15px;
    width: 130px;
    height: 80px;
  }
</style>
<template>
  <tool-bar-medium-card>
    <ul :style="{marginLeft: '-6%'}">
      <li v-for="(item, index) in items" :key="index"> 
        <b>{{ item.label }}:</b> {{ item.value }}
      </li>
    </ul>
  </tool-bar-medium-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Option } from "@/components/Forms/FieldInterface";
import ToolBarMediumCard from "@/components/Cards/ToolbarMediumCard.vue"
export default defineComponent({
  name: "HisResultCard",
  components: {ToolBarMediumCard},
  props: {
    icon: {
      required: false,
    },
    items: {
      type: Object as PropType<Option[]>,
      required: true,
    },
  },
});
</script>
<style scoped>
  b {
    color: rgb(71, 70, 70);
  }
  ul li {
    list-style: none;
    color: rgb(94, 92, 92);
  }
</style>
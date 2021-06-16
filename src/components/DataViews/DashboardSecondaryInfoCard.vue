<template>
  <div id="card">
    <ul>
      <li v-for="(item, index) in items" :key="index"> 
        <b> {{ item.label }}: </b> {{ item.value }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Option } from "@/components/Forms/FieldInterface";
export default defineComponent({
  name: "HisResultCard",
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
    #card {
      border: 1px solid #ccc;
      border-radius: 5px;
      height: 128px;
      overflow-y: auto;
  -webkit-box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.1);
-moz-box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.1);
box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.1);
    }
    #card ul li {
      list-style: none;
    }
</style>
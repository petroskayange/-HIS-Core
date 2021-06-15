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
    title: {
      type: String,
      required: true,
    },
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
      border-radius: 10px;
      height: 125px;
      overflow-y: auto;
      -webkit-box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
      -moz-box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
      box-shadow: 0px -2px 19px -2px rgba(196, 190, 196, 1);
    }
    #card ul li {
      list-style: none;
    }
</style>
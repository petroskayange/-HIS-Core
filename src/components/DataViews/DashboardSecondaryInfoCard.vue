<template>
  <div id="card">
    <ul :style="{marginLeft: '-6%'}">
      <li v-for="(item, index) in items" :key="index"> 
        <b>{{ item.label }}:</b> {{ item.value }}
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
      border-radius: 15px;
      height: 110px;
      overflow-y: hidden;
-webkit-box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
-moz-box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
box-shadow: -1px 4px 30px -16px rgba(0,0,0,0.28);
    }
    b {
      color: rgb(71, 70, 70);
    }
    #card ul li {
      list-style: none;
      color: rgb(94, 92, 92);
    }
    hr.dotted {
      border-top: 3px dotted #bbb;
    }
</style>
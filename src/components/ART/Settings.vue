
<template>
  <component :is="component" :slotData="slotData"></component>
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent, ref, computed } from "vue";

export default defineComponent({
  props: {
    collectionName: String,
  },
  methods: {
    doStuff() {
      this.name("@/componenents/ART/overview.vue");
    },
  },
  created() {
      this.component = () => import('@/componenents/ART/overview.vue');
  },
  data() {
    return {
      component: null as any
    }
  },
  setup() {
    const isShow = ref(false);
    const name = computed((name: string) =>
      isShow.value ? defineAsyncComponent(() => import(name)) : ""
    );

    const onClick = () => {
      isShow.value = true;
    };
    return {
      name,
    };
  },
});
</script>

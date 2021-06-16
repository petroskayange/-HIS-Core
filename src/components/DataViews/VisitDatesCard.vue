<template>
  <div class="card">
    <h4>
      <center>{{ title }}</center>
    </h4>
    <div v-for="(item, index) in items" :key="index">
      <center>
        <ion-button
          :color="isActive(item) ? 'primary' : 'light'"
          class="btn"
          @click="onselect(item)"
        >
          {{ item.label }}
        </ion-button>
      </center>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Option } from "@/components/Forms/FieldInterface";
import { IonButton } from "@ionic/vue";

export default defineComponent({
  components: { IonButton },
  props: {
    title: {
      type: String,
      default: () => "Visits",
    },
    items: {
      type: Object as PropType<Option[]>,
      required: true,
    },
  },
  data: () => ({
    active: {} as Option,
  }),
  watch: {
    items: {
      handler(items: Array<Option> | undefined) {
        if (Array.isArray(items)){
            this.active = items[0];
        }
      },
      deep: true,
      immediate: true,
    },
    active(item: Option) {
      this.$emit("onselect", item);
    },
  },
  methods: {
    onselect(item: Option) {
      this.active = item;
    },
    isActive(item: Option) {
      return item.label === this.active.label;
    },
  },
});
</script>
<style scoped>
.btn {
  width: 90%;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
}
.card {
  height: 69vh;
  background-color: rgb(255, 255, 255);
  overflow: hidden;
  border-right: 2px solid #ccc;
-webkit-box-shadow: 4px 1px 5px 0px rgba(0,0,0,0.17);
-moz-box-shadow: 4px 1px 5px 0px rgba(0,0,0,0.17);
box-shadow: 4px 1px 5px 0px rgba(0,0,0,0.17);
}
</style>

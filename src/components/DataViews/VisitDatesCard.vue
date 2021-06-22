<template>
  <div class="card">
    <h4>
      <center>{{ title }}</center>
    </h4>
    <center>
    <ion-button color="light" :disabled="!showPrevButton" @click="goPrev">
      <img src="/assets/images/drop-up-arrow.svg" width="30"/>
    </ion-button>
    <div class='dates' v-for="(item, index) in activeListItems" :key="index">
        <ion-button
          class="btn"
          :color="isActive(item) ? 'primary' : 'light'"
          @click="onselect(item)"
        >
          {{ item.label }}
        </ion-button>
    </div>
    <ion-button color="light" :disabled="!showNextButton" @click="goNext">
      <img src="/assets/images/drop-down-arrow.svg" width="30"/>
    </ion-button>
    </center>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Option } from "@/components/Forms/FieldInterface";
import { IonButton } from "@ionic/vue";
import { chunk, isEmpty } from "lodash"

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
    activeListItems: [] as any,
    paginatedListItems: [] as any,
    index: -1,
    perPage: 7
  }),
  computed: {
    showNextButton(): boolean {
      return this.index +1 < this.paginatedListItems.length
    },
    showPrevButton(): boolean {
      return this.index >= 1
    }
  },
  watch: {
    items: {
      handler(items: Array<Option> | undefined) {
        if (isEmpty(items)) return

        this.index = 0
        this.paginatedListItems = chunk(items, this.perPage)
        this.activeListItems = this.paginatedListItems[0]
        this.active = this.activeListItems[0]
      },
      deep: true,
      immediate: true,
    },
    index : {
      handler(num: number){
        this.activeListItems = this.paginatedListItems[num]
      },
      immediate: true
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
    goNext() {
      const nextIndex = this.index + 1
      if (nextIndex <= this.paginatedListItems.length) {
        this.index = nextIndex
      }
    },
    goPrev() {
      if (this.paginatedListItems.length >= 1) {
        this.index -= 1
      }
    }
  },
});
</script>
<style scoped>
.btn {
  width: 90%;
  text-align: center;
}
.dates {
text-align: center;
vertical-align: middle;
line-height: 60px;
}
.card {
  overflow: hidden;
  height: 100%;
  background-color: rgb(255, 255, 255);
  border-right: 1px solid #ccc;
  -webkit-box-shadow: 10px 0px 17px -12px rgba(0,0,0,0.4);
  -moz-box-shadow: 10px 0px 17px -12px rgba(0,0,0,0.4);
  box-shadow: 10px 0px 17px -12px rgba(0,0,0,0.4);
}
</style>

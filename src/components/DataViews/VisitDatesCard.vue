<template>
  <div class="card his-card">
    <ion-button 
      color="light" 
      class="nav-btn" 
      :disabled="!showPrevButton" 
      @click="goPrev">
      <img :src="upbuttonImg" :width="btnSize"/>
    </ion-button>
    
    <div class="header-section">
      {{ title }} 
    </div>
    
    <ion-list> 
      <ion-item
        v-for="(item, index) in activeListItems" :key="index"
        @click="onselect(item)"
        :detail="true"
        :color="isActive(item) ? 'primary' : ''"
      > 
        {{ item.label }}
      </ion-item>
    </ion-list>

    <div class="bottom-section"> 
      <ion-button 
        class="nav-btn" 
        color="light" 
        :disabled="!showNextButton" 
        @click="goNext">
        <img :src="downbuttonImg" :width="btnSize"/>
      </ion-button>
    </div>
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
    perPage: 7,
    btnSize: 45
  }),
  computed: {
    upbuttonImg(): string {
      return '/assets/images/drop-up-arrow.svg'
    },
    downbuttonImg(): string {
      return '/assets/images/drop-down-arrow.svg'
    },
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
.card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.nav-btn {
  margin-left: 14%;
  width: 70%;
}
.header-section {
  text-align: center;
  font-weight: bold;
  margin: 10%;
}
.bottom-section {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

<template>
  <div class="card">
    <div class="header-section"> {{ title }} </div>
    
    <div class="top-section"> 
      <ion-button class="pagination-button" color="light" mode="ios" :disabled="!showPrevButton" @click="goPrev">
        <img src="/assets/images/drop-up-arrow.svg" width="30"/>
      </ion-button>
    </div>
    
    <div class="body-section">
      <ion-row>
        <ion-col size="12" v-for="(item, index) in activeListItems" :key="index"> 
          <ion-button
            class="pagination-button"
            @click="onselect(item)"
            :color="isActive(item) ? 'primary' : 'light'"
          >
            {{ item.label }}
          </ion-button>
        </ion-col>
      </ion-row>
    </div>
    
    <div class="bottom-section"> 
      <ion-button class="pagination-button" color="light" mode="ios" :disabled="!showNextButton" @click="goNext">
        <img src="/assets/images/drop-down-arrow.svg" width="30"/>
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
.card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(255, 255, 255);
  border-right: 1px solid #ccc;
  -webkit-box-shadow: 10px 0px 17px -12px rgba(0,0,0,0.4);
  -moz-box-shadow: 10px 0px 17px -12px rgba(0,0,0,0.4);
  box-shadow: 10px 0px 17px -12px rgba(0,0,0,0.4);
}
.date-button {
  width: 90%;
  text-align: center;
}

.pagination-button {
  width: 100%;
  text-align: center;
}

.header-section .top-section .body-section .bottom-section {
  overflow: hidden;
}

.header-section {
  text-align: center;
  font-weight: bold;
  padding: 10px;
  height: 6%;
}

.top-section {
  height: 8%;
}

.body-section {
  position: absolute;
  height: 60%;
  line-height: 52px;
  margin: auto;
  left: 0;
  right: 0;
}

.bottom-section {
  position: absolute;
  height: 12%;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

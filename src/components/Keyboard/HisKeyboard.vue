<template>
  <ion-grid class="key-b">
    <ion-row>
      <ion-col :size="activeLayout.colSizePrimary || 9">
        <base-keyboard :layout="activeLayout.primaryKeyBoard" :onKeyPress="keypress" />
      </ion-col>
      <ion-col v-if="activeLayout.colSizeSpace" :size="activeLayout.colSizeSpace"></ion-col>
      <ion-col :size="activeLayout.colSizeSecondary || 3">
        <base-keyboard :layout="activeLayout.secondaryKeyboard" :onKeyPress="keypress" />
      </ion-col>
    </ion-row>
  </ion-grid>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IonGrid, IonRow, IonCol } from "@ionic/vue";
import { HisKeyboardConfig, KEY_BTN_NAV } from "@/components/Keyboard/HisKbConfigurations"
import BaseKeyboard from "@/components/Keyboard/BaseKeyboard.vue";
export default defineComponent({
  components: { BaseKeyboard, IonGrid, IonRow, IonCol },
  props: {
    kbConfig: {
      type: Object as PropType<HisKeyboardConfig>,
      required: true
    },
    onKeyPress: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    activeLayout: {} as HisKeyboardConfig
  }),
  mounted() {
    this.activeLayout = this.kbConfig
  },
  methods: {
    keypress(key: any) {
      if (!this.isFunctionKey(key)) {
        this.onKeyPress(key);
      }
    },
    isFunctionKey(key: string) {  
      if (this.switchKeyboard(key)) {
        return true
      }
      return false
    },
    switchKeyboard(key: string): boolean {
      const kbIndex = KEY_BTN_NAV.map(item => item.btn).indexOf(key)
      if (kbIndex >= 0) {
        this.activeLayout = KEY_BTN_NAV[kbIndex].keyboard
        return true
      }
      return false
    }
  },
});
</script>
<style scoped>
.key-b {
  left: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  border-radius: 15px;
  border-color: #ccc;
  border-style: solid;
  border-width: 2px;
}
</style>
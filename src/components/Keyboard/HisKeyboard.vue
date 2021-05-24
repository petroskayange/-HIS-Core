<template>
  <ion-grid class="key-b" fixed>
    <ion-row>
      <ion-col size="9">
        <base-keyboard :layout="activeLayout.primaryKeys" :onKeyPress="keypress" />
      </ion-col>
      <ion-col size="3">
        <base-keyboard :layout="activeLayout.functionKeys" :onKeyPress="keypress" />
      </ion-col>
    </ion-row>
  </ion-grid>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  NUMBER_ONLY,
  ALPHABETICAL,
  QWERTY,
  QWERTY_FUNCTION_KEYS,
  CHARACTERS_AND_NUMBERS,
  ALPHABETICAL_FUNCTION_KEYS,
  NUM_FUNCTION_KEYS,
} from "@/components/Keyboard/KbLayouts";
import { IonGrid, IonRow, IonCol } from "@ionic/vue";
import BaseKeyboard from "@/components/Keyboard/BaseKeyboard.vue";
export default defineComponent({
  components: { BaseKeyboard, IonGrid, IonRow, IonCol },
  props: {
    onKeyPress: {
      type: Function,
      required: true,
    },
  },
  methods: {
    keypress(key: any) {
      const fk = this.resolveFunctionKeys(key)
      if (fk != undefined) {
        this.onKeyPress(key);
      }
    },
    resolveFunctionKeys(key: string){
      if (key.match(/qwerty/i)) {
        this.activeLayout = this.layouts.qwerty
      }else if (key.match(/a-z/i)) {
        this.activeLayout = this.layouts.alphabetical
      }else if (key.match(/0-9/i)) {
        this.activeLayout = this.layouts.numerical
      } else {  
        return key
      }
    }
  },
  mounted(){
    this.activeLayout = this.layouts.qwerty
  },
  data: () => ({
    activeLayout: {},
    layouts: {
      alphabetical: {
        primaryKeys: ALPHABETICAL,
        functionKeys: ALPHABETICAL_FUNCTION_KEYS,
      },
      numerical: {
        primaryKeys: NUMBER_ONLY,
        functionKeys: NUM_FUNCTION_KEYS,
      },
      qwerty: {
        primaryKeys: QWERTY,
        functionKeys: QWERTY_FUNCTION_KEYS,
      },
      qwertyNumerical: {
        primaryKeys: CHARACTERS_AND_NUMBERS,
        functionKeys: [],
      },
    },
  }),
});
</script>
<style scoped>
.key-b {
  left: 0;
  bottom: 55px;
  position: absolute;
  width: 100%;
}
</style>
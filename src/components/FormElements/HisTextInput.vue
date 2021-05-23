<template> 
    <ion-input
      :value="value"
      type="text"
      class="input_display"
      :disabled="disabled"
    />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import {IonInput} from '@ionic/vue'
export default defineComponent({
    name: "HisInput",
    components: { IonInput},
    props: {
        value: {
            required: false
        },
        type: {
            type: String,
            required: true
        },
        disabled:{
            type: Boolean
        }
    }
})
</script>
<style scoped>
.input_display {
  border: 1px solid rgb(94, 91, 91);
  border-radius: 5px;
  width: 100%;
  font-family: Nimbus Sans L, Arial Narrow, sans-serif;
  font-size: 2.2em;
  background-color: rgb(231, 231, 231);
  color: #000;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
}
</style>
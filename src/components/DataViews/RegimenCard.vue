<template>
    <div :class="`his-card ${state}`"  @click="onclick"> 
        <div class='title' v-if="showTitle"> <b> {{ value }} </b></div> 
        <div>{{ label }}</div>
        <div> </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    showTitle: {
        type: Boolean,
        default: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    color: {
        type: String
    },
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
  },
  computed: {
      state(): string {
          if (this.enabled) return `${this.color} clickable`

          return 'disabled-card-color'
      }
  },
  methods: {
    onclick() { if (this.enabled) this.$emit('onclick') }
  }  
})
</script>
<style scoped>
 .title {
    border-style: solid;
    border-width: 0px 1px 0px 0px;
    text-align: center;
    min-width: 35px;
    font-weight: bold;
 }
 .his-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 50px;
    margin: 1.4%;
 }

</style>

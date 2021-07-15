<template>
    <div :class="`his-card ${state}`"  @click="onclick"> 
        <b v-if="showTitle">{{ value }}</b> {{ label }}
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
 .his-card {
    height: 50px;
    margin: 1.4%;
    text-align: center;
 }
</style>

<template>
    <view-port :showFull="!showKeyboard">
        <his-text-input :value="selected" @onValue="(value) => onKbValue(value, showKeyboard)" /> 
        <ion-list class='view-port-content'>
            <ion-item 
                button v-for="(item, index) in filtered" 
                :color="item.label === selected ? 'light': ''" 
                :key="index"
                @click="onselect(item)"> 
                <ion-label> {{item.label}} </ion-label>
            </ion-item>
        </ion-list>
    </view-port>
    <his-keyboard v-if="showKeyboard" :kbConfig="keyboard" :onKeyPress="keypress"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Option } from '../Forms/FieldInterface'
import SelectMixin from "@/components/FormElements/SelectMixin.vue"
import { find } from "lodash"

export default defineComponent({
    name: "HisSelect",
    mixins: [SelectMixin],
    watch: {
        clear(val: boolean){ if (val) this.clearSelection() }
    },
    async activated() {
        this.listData = await this.options(this.fdata)
        if (this.preset) {
            const found = find(this.listData, {label: this.preset.label})

            if (found) this.onselect(found)
        }
    },
    methods: {
        onselect(item: Option): void {
            this.selected = item.label
            this.$emit('onValue', item)
        }
    }
})
</script>
<style scoped>
    .view-port-content {
        height: 89%;
    }
</style>
<template>
    <div>
        <view-port :showFull="!showKeyboard">
            <his-text-input :value="selected" @onValue="(value) => onKbValue(value, showKeyboard)" /> 
            <ion-list class='view-port-content'>
                <ion-item button v-for="(item, index) in filtered" :key="index" @click="onselect(item)"> 
                    <ion-label> {{item.label}} </ion-label>
                </ion-item>
            </ion-list>
        </view-port>
        <his-keyboard v-if="showKeyboard" :kbConfig="keyboard" :onKeyPress="keypress"/>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Option } from '../Forms/FieldInterface'
import SelectMixin from "@/components/FormElements/SelectMixin.vue"
export default defineComponent({
    name: "HisSelect",
    mixins: [SelectMixin],
    watch: {
        clear(val: boolean){
            if (val) this.clearSelection()
        }
    },
    async activated() {
        this.listData = await this.options(this.fdata)
    },
    async mounted() {
        this.listData = await this.options(this.fdata)
        if (this.preset) {
            this.onselect(this.preset)
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
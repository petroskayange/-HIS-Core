<template>
    <base-input :value="value"/>
    <ion-list>
        <ion-item button v-for="(item, index) in listData" :key="index" @click="onselect(item)"> 
            <ion-label> {{item.label}} </ion-label>
        </ion-item>
    </ion-list>
    <his-keyboard :kbConfig="keyboard" :onKeyPress="keypress" :disabled="false"> </his-keyboard>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseInput from "@/components/FormElements/BaseTextInput.vue"
import HisKeyboard from "@/components/Keyboard/HisKeyboard.vue"
import handleVirtualInput from "@/components/Keyboard/KbHandler"
import { Option } from '../Forms/FieldType'
import { QWERTY } from "@/components/Keyboard/HisKbConfigurations"

export default defineComponent({
    components: { BaseInput, HisKeyboard },
    data: ()=>({ 
        value: '',
        keyboard: QWERTY,
        listData: [] as Array<Option>
    }),
    props: {
        fdata: {
            type: Object,
            required: true
        },
        options: {
            type: Function,
            required: false,
        },
        clear: {
            type: Boolean
        }
    },
    methods: {
        onselect(item: Option){
            this.value = item.label
            this.$emit('onValue', item)
        },
        async keypress(text: any){
            this.value = handleVirtualInput(text, this.value)
            if (this.options) {
                this.listData = await this.options(this.fdata)  
            }
            this.$emit('onValue', { label: this.value, value: this.value })
        }
    },
    watch: {
        clear(val: boolean){
            if (val) this.value = ''
        }
    }
})
</script>
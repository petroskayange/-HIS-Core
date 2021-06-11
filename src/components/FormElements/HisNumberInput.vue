<template>
    <view-port>
        <base-input :value="value"/>
    </view-port>
    <his-keyboard :kbConfig="keyboard" :onKeyPress="keypress" :disabled="false"> </his-keyboard>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseInput from "@/components/FormElements/BaseTextInput.vue"
import HisKeyboard from "@/components/Keyboard/HisKeyboard.vue"
import handleVirtualInput from "@/components/Keyboard/KbHandler"
import { NUMBERS_ONLY } from "@/components/Keyboard/HisKbConfigurations"
import ViewPort from "@/components/DataViews/ViewPort.vue"

export default defineComponent({
    components: { BaseInput, HisKeyboard, ViewPort },
    data: ()=>({ 
        value: '',
        keyboard: NUMBERS_ONLY,
    }),
    props: {
        clear: {
            type: Boolean
        }
    },
    methods: {
        async keypress(text: any){
            this.value = handleVirtualInput(text, this.value)
            this.$emit('onValue', { label: this.value, value: this.value })
        }
    },
    watch: {
        clear(val: boolean){
            if (val) {
                this.value = ''
                this.$emit('onClear')
            }
        }
    }
})
</script>
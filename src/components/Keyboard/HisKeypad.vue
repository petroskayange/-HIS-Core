<template>
    <ion-header> 
        <ion-toolbar> 
            <ion-title> {{ title || 'keypad'}} </ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content> 
        <div class="keypad">
            <ion-input :value="value" :disabled="true" class='keypad-input'/> 
            <base-keyboard btnSize="96px" :layout="keypad" :onKeyPress="keypress"/> 
        </div>
    </ion-content>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseKeyboard from '@/components/Keyboard/BaseKeyboard.vue'
import { DEFAULT_KEYPAD } from '@/components/Keyboard/KbLayouts'
import handleVirtualInput from '@/components/Keyboard/KbHandler'
import { modalController } from '@ionic/core'
export default defineComponent({
    components: { BaseKeyboard },
    props: {
        title: {
            type: String
        },
        onKeyPress: {
            type: Function,
            required: true,
        },
    },
    data: () => ({
        value: '0',
        keypad: DEFAULT_KEYPAD
    }),
    methods: {
        async keypress(key: any) {
            
            if (key.match(/done/i)) {
                await modalController.dismiss()
            } else {
                if (key && this.value === '0') this.value = ''

                this.value = handleVirtualInput(key, this.value)
                
                
                if (!this.value) this.value = '0'
                
                this.onKeyPress(parseInt(this.value))
            }
        }
    }
})
</script>
<style scoped>
.keypad {
    background: #F4F4F4;
    padding: 0.7em;
    margin: auto;
}
.his-keyboard-margin {
 padding: 0px!important;
}

.his-keyboard-btn {
    width: 110px!important;
}
.his-keyboard {
    width: 100% !important;
}
.keypad-input {
    border: solid 1px #ccc;
    background: white;
    border-radius: 10px;
    width: 100%;
    height: 70px;
    text-align: center;
    font-size: 3em;
}
</style>

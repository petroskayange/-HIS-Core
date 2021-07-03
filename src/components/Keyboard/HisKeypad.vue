<template>
    <ion-content> 
        <div class="keypad">
            <ion-input :disabled="true" class='keypad-input'/> 
            <base-keyboard btnSize="96px" :layout="keypad" @keypress="onkey"/> 
        </div>
    </ion-content>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseKeyboard from '@/components/Keyboard/BaseKeyboard.vue'
import { DEFAULT_KEYPAD } from '@/components/Keyboard/KbLayouts'

export default defineComponent({
    components: { BaseKeyboard },
    props: {
        onKeyPress: {
            type: Function,
            required: true,
        },
    },
    data: () => ({
        keypad: DEFAULT_KEYPAD
    }),
    methods: {
        keypress(key: any) {
            this.onKeyPress(key)
        },
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

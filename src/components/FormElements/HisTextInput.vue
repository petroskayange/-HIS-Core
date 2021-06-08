<template>
<ion-grid>
        <ion-row >
            <ion-col v-if="config.prepend" size-md="2">
                <p>{{config.prependValue}}</p>
            </ion-col>
            <ion-col size-md="">
                <base-input :value="value"/>
            </ion-col>
        </ion-row>
      </ion-grid>
    <!-- <base-input :value="value"/> -->
    <ion-list v-if="listData.length > 0">
        <ion-item button v-for="(item, index) in listData" :key="index" @click="onselect(item)"> 
            <ion-label> {{item.label}} </ion-label>
        </ion-item>
    </ion-list>
    <his-keyboard :kbConfig="keyboard" :onKeyPress="keypress" :disabled="false"> </his-keyboard>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import BaseInput from "@/components/FormElements/BaseTextInput.vue"
import HisKeyboard from "@/components/Keyboard/HisKeyboard.vue"
import handleVirtualInput from "@/components/Keyboard/KbHandler"
import { IonList, IonItem, IonLabel} from "@ionic/vue"
import { Option } from '../Forms/FieldInterface'
import { QWERTY } from "@/components/Keyboard/HisKbConfigurations"
import { TextInput } from '@/components/FormElements/Interfaces/TextConfig'
export default defineComponent({
    components: { BaseInput, HisKeyboard, IonList, IonItem, IonLabel },
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
        config: {
            type: Object as PropType<TextInput>
        },
        clear: {
            type: Boolean
        },
    },
    methods: {
        onselect(item: Option){
            this.value = item.label
            this.$emit('onValue', item)
        },
        async keypress(text: any){
            this.value = handleVirtualInput(text, this.value)
            this.$emit('onValue', { label: this.value, value: this.value })
        }
    },
    watch: {
        fdata: {
            async handler(data: any) {
              if (this.options) {
                this.listData = await this.options(data)
              }
            },
            deep: true
        },
        clear(val: boolean){
            if (val) this.value = ''
        }
    }
})
</script>
<template>
    <div>
        <his-text-input :value="selected" /> 
        <ion-list>
            <ion-item button v-for="(item, index) in options" :key="index" @click="onselect(item)"> 
                <ion-label> {{item.label}} </ion-label>
            </ion-item>
        </ion-list>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {  Option } from '../Forms/FieldType'
import { IonList, IonItem, IonLabel} from "@ionic/vue"
import HisTextInput from "@/components/FormElements/HisTextInput.vue";

export default defineComponent({
    name: "HisSelect",
    components: {
        IonList, IonItem, IonLabel, HisTextInput
    },
    props: {
        clear: {
            type: Boolean
        },
        options: {
            required: true,
            type: Object as PropType<Option[]> 
        }
    },
    data: () => ({ selected: '' }),
    watch: {
        clear(val: boolean){
            if (val) {
                this.selected = ''
                this.$emit('onClear')
            } 
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
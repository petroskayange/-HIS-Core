<template>
    <view-port> 
        <div class='view-port-content'>
            <ion-grid> 
                <ion-row> 
                    <ion-col size="4">
                        <ion-row v-for="(row, rowIndex) in listData" :key="rowIndex"> 
                            <ion-col size="6" v-for="(item, itemIndex) in row" :key="itemIndex"> 
                                <regimen-card
                                    :label="item.label" 
                                    :value="item.value"
                                    @onclick="onselect(item)"
                                    :color="item.label === selected ? 'active-card-color' : 'inactive-card-color'"/>
                            </ion-col>
                        </ion-row>
                    </ion-col>
                    <ion-col size="8">
                        <ion-card :style="{height: '65vh'}">
                            <ion-card-content v-if="active.label">
                                <h3> {{ active.other.label }} </h3>
                                <ion-item>
                                   <ion-label> {{ active.other.value }} </ion-label>
                                </ion-item>
                                <h3> {{ active.other.other.label }} </h3>
                                <ion-list>
                                    <ion-item v-for="(item, index) in active.other.other.value" :key="index"> 
                                       <ion-label> {{ item.label }} </ion-label>
                                       <ion-chip color="primary" slot="end"> {{ item.value }} </ion-chip>
                                    </ion-item>
                                </ion-list>  
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </div>
    </view-port>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Option } from '../Forms/FieldInterface'
import RegimenCard from '@/components/DataViews/RegimenCard.vue'
import ViewPort from '../DataViews/ViewPort.vue'
import SelectMixin from "@/components/FormElements/SelectMixin.vue"
import Transformer from '@/utils/Transformers'
export default defineComponent({
    components: { RegimenCard, ViewPort },
    mixins: [SelectMixin],
    data: ()=>({
        active: {} as Option
    }),
    watch: {
        clear(val: boolean){
            if (val) this.clearSelection()
        }
    },
    async activated() {
        this.init()
    },
    async mounted() {
        this.init()
        if (this.preset) this.onselect(this.preset)
    },
    methods: {
        async init() {
            const options = await this.options(this.fdata)
            this.listData = Transformer.convertArrayToTurples(options)
        },
        onselect(item: Option): void {
            this.selected = item.label
            this.active = item
            this.$emit('onValue', item)
        }
    }
})
</script>
<style scoped>
.view-port-content {
    height: 100%;
}
</style>

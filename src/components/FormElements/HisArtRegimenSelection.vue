<template>
    <view-port> 
        <div class="view-port-content"> 
            <ion-row v-for="(row, rowIndex) in listData" :key="rowIndex"> 
                <ion-col size-md="6" size-sm="12" v-for="(item, itemIndex) in row" :key="itemIndex"> 
                    <regimen-card
                        :label="item.label" 
                        :value="item.value"
                        @onclick="onselect(item)"
                        :color="item.label === selected ? 'active-card-color' : 'inactive-card-color'"
                    />
                </ion-col>
            </ion-row>
        </div>
    </view-port>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Option } from '../Forms/FieldInterface'
import ViewPort from "@/components/DataViews/ViewPort.vue"
import SelectMixin from "@/components/FormElements/SelectMixin.vue"
import Transformer from '@/utils/Transformers'
import RegimenCard from "@/components/DataViews/RegimenCard.vue"
import { find } from "lodash"
export default defineComponent({
    components: { ViewPort, RegimenCard },
    mixins: [SelectMixin],
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
    },
    methods: {
        async init() {
            const options = await this.options(this.fdata)
            this.listData = Transformer.convertArrayToTurples(options)

            if (this.preset) {
                const item = find(options, this.preset)
                if (item) this.onselect(item)
            }
        },
        onselect(item: Option): void {
            this.selected = item.label
            this.$emit('onValue', item)
        }
    }
})
</script>
<style scoped>
#view-port {
    height: 74vh;
}
.view-port-content {
    height: 100%;
}
</style>


<template>
    <view-port>
        <div class="view-port-content"> 
            <ion-list>
                <ion-item v-for="(item, index) in listData" :key="index">
                    <ion-label> {{item.label}} </ion-label>
                    <ion-label slot="end"> {{item.value}} </ion-label>
                </ion-item>
            </ion-list>
        </div>
  </view-port>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Option } from "@/components/Forms/FieldInterface"
import ViewPort from "@/components/DataViews/ViewPort.vue"
export default defineComponent({
    components: { ViewPort },
    data: () => ({
        listData: [] as Array<Option[]>
    }),
    props: {
        fdata: {
            type: Object,
            required: true
        },
        cdata: {
            type: Object,
            required: true
        },
        options: {
            type: Function,
            required: true
        }
    },
    async activated() {
        this.listData = this.options(this.fdata, this.cdata)
    }
})
</script>
<style scoped>
    .view-port-content {
        height: 100%;
    }
</style>

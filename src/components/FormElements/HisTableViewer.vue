<template>
    <view-port> 
        <div class="view-port-content"> 
            <his-table :columns="columns" :rows="rows"/>
        </div>
    </view-port>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import HisTable from "@/components/DataViews/HisBasicTable.vue"
import ViewPort from "@/components/DataViews/ViewPort.vue"
import { isEmpty } from "lodash"
export default defineComponent({
    components: { ViewPort, HisTable },
    data: ()=>({
        columns: [] as Array<string>,
        rows: [] as Array<string>,
    }),
    props: {
        fdata: {
            type: Object,
            required: true
        },
        options: {
            type: Function,
            required: true
        }
    },
    async activated() {
        const data = await this.options(this.fdata)
        if (isEmpty(data)) return

        const { other } = data[0]
        this.columns = other.columns
        this.rows = other.rows
    }
})
</script>
<template>
    <view-port>
        <div> 
            <ul class='primary-info'> 
                <li v-for="(item, pindex) in titleItems" :key="pindex"> 
                    <b>{{ item.label }}:</b> {{item.value}}
                </li>
            </ul>
        </div>
        <div class="view-port-content">
            <b :style="{marginLeft: '3%'}"> {{ config.title }} </b>
            <ul class='secondary-info'> 
                <li v-for="(item, index) in bodyItems" :key="index"> 
                    {{ item.value }}
                </li>
            </ul>
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
        listData: [] as Array<Option>
    }),
    props: {
        fdata: {
            type: Object,
            required: true
        },
        config: {
            type: Object
        },
        options: {
            type: Function,
            required: true
        }
    },
    computed: {
        titleItems(): Array<Option> {
            return this.listData.filter((item) => item.other?.type === 'title-section')
        },
        bodyItems(): Array<Option> {
            return this.listData.filter((item) => item?.other?.type != 'title-section')
        }
    },
    async activated() {
        this.listData = this.options(this.fdata)
    }
})
</script>
<style scoped>
    .primary-info li {
        list-style: none;
        margin-bottom: 10px;
    }
    .secondary-info li {
        margin-bottom: 10px;
    }
    .view-port-content {
        padding: 2%;
        background: white;
        height: 100%;
    }
</style>

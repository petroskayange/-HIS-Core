<template>
    <ion-row> 
        <ion-col v-for="(item, index) in items" :key="index" size="12"> 
            <interval-card 
                @onclick="onclick(item)" 
                :color="active.label === item.label ? 'active-card-color' : ''"
                :label="item.label"> 
            </interval-card>
        </ion-col>
    </ion-row>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Option } from "@/components/Forms/FieldInterface"
import IntervalCard from "@/components/DataViews/IntervalCard.vue"

export default defineComponent({
    components: { IntervalCard },
    data: () => ({
        active: {} as Option
    }),
    props: {
        items: {
            type: Object as PropType<Option[]>,
            required: true
        }
    },
    methods: {
        onclick(item: Option){
            this.active = item
            this.$emit('onSelect', item)
        }
    }
})
</script>
<style scoped>
    .his-card {
        margin: auto;
        width: 98%;
    }
    .active-card-color {
        color: white !important;
        border-color: white !important;
    }
</style>

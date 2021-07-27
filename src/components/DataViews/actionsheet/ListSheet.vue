<template>
    <ul> 
        <li v-for="(item, index) in options" :key="index">
            {{ item.value }}
        </li>
    </ul>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Option } from "@/components/Forms/FieldInterface"
export default defineComponent({
    props: {
        options: {
            type: Object as PropType<Option[]>,
            required: true
        }
    }
})
</script>
<style scoped>
    ul {
        font-weight: bold;
    }
</style>

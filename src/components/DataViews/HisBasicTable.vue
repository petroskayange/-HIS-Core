<template>
    <table class="his-table">
        <!-- <thead> -->
            <tr>
                <th v-for="(column, hIndex) in columns" :key="hIndex"> 
                    {{ column }}
                </th>
            </tr>
        <!-- </thead> -->
        <!-- <tbody> -->
            <tr v-for="(dataItems, rIndex) in rows" :key="rIndex">
                <td v-for="(item, dIndex) in dataItems" :key="dIndex"> 
                    {{ item }}
                </td>
            </tr>
        <!-- </tbody> -->
        </table>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    props: {
        columns: {
            type: Object as PropType<string[]>,
            required: true
        },
        rows: {
            type: Object as PropType<string[]>
        }
    }
})
</script>

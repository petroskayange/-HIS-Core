<template>
    <table class="his-table">
        <tr>
            <th v-for="(column, hIndex) in columns" :key="hIndex"> 
                {{ column }}
            </th>
        </tr>
        <tr  v-for="(dataItems, rIndex) in rows" :key="rIndex">
            <td :class="getColorCodeClass(rIndex, dIndex)" v-for="(item, dIndex) in dataItems" :key="dIndex"> 
                {{ item }}
            </td>
        </tr>
    </table>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        colorCodes: {
            type: Object,
            default:() => ({
                rows: {
                    class: '',
                    indexes: []
                },
                cells: {
                    class: '',
                    indexes: []
                }
            })
        },
        columns: {
            type: Object as PropType<string[]>,
            required: true
        },
        rows: {
            type: Object as PropType<string[]>
        }
    },
    methods: {
        getColorCodeClass(rIndex: number, dIndex: number) {
            let styleClass = ''
            const conf = this.colorCodes
            if ('rows' in conf && conf.rows.indexes.includes(rIndex)) {
                styleClass = this.colorCodes.rows.class
            }

            if ('cells' in conf && conf.cells.indexes.includes(dIndex)) {
                styleClass = this.colorCodes.cells.class
            }

            return styleClass
        }
    }
})
</script>

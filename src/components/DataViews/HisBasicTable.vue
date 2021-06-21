<template>
    <table>
        <thead>
            <tr> 
                <th v-for="(column, hIndex) in columns" :key="hIndex"> 
                    {{ column }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(dataItems, rIndex) in rows" :key="rIndex">
                <td v-for="(item, dIndex) in dataItems" :key="dIndex"> 
                    {{ item }}
                </td>
            </tr>
        </tbody>
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
<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
td,
th {
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #f8f8f8;
}
</style>

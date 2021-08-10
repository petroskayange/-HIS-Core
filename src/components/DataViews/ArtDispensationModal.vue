<template>
    <ion-content>
        <table> 
            <thead> 
                <tr>
                    <th colspan="6"> Cotrimoxazole (960mg) </th>
                </tr>
                <tr> 
                    <th>Total tab(s) needed </th>
                    <th colspan="2"> Available stock </th>
                    <th colspan="2"> Dispensed </th>
                    <th> </th>
                </tr>
                <tr> 
                    <th> </th>
                    <th> Pack size </th>
                    <th> Packs </th>
                    <th> Total Tab(s) </th>
                    <th> Packs </th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                <tr> 
                    <td :rowspan="amountNeededRowSpan"> {{tabsNeeded}} tab(s) </td>
                </tr>
                <tr v-for="(list, index) in items" :key="index">
                    <td 
                        v-for="(data, dIndex) in list" 
                        :key="dIndex"
                        :class="dIndex === 3 ? 'input-field' : ''"> 
                        {{ data }} 
                    </td>
                    <td> 
                        <ul class='btn-list'> 
                            <li> <ion-button class='dispense-btn' size="large"> + </ion-button> </li>
                            <li> <ion-button class='dispense-btn' size="large"> - </ion-button> </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    </ion-content>
    <ion-footer>
        <ion-toolbar> 
        <ion-button color="danger" size="large" slot="end"> Close </ion-button>
        <ion-button color="success" size="large" slot="end"> Dispense </ion-button>
        </ion-toolbar>
    </ion-footer>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data: () => ({
        tabsNeeded: 14,
        items: [
            [
                30, 
                1,
                30,
                0
            ],
            [
                60, 
                1,
                30,
                0
            ],
            [
                90, 
                1,
                30,
                0
            ],
        ]
    }),
    computed: {
        amountNeededRowSpan(): number {
            return this.items.length + 1
        }
    }
})
</script>

<style scoped>
    table {
        width: 100%;
    }
    table, td, th {
        border: solid 1px #ccc;
        text-align: center;
        vertical-align: middle;
    }
    td {
        height: 120px;
    }
    .btn-list {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .dispense-btn {
        width: 60px;
    }
    .input-field {
        font-weight: bold;
        font-size: 1.3em;
        border: 2px solid #ccc;
        background-color: rgb(248, 248, 167);
    }
</style>
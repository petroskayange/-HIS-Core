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
                <tr v-for="(list, rIndex) in items" :key="rIndex">
                    <td 
                        v-for="(amount, cIndex) in list" 
                        :key="cIndex"
                        :class="cIndex >= 2 ? 'input-field' : ''"> 
                        {{ amount }}
                    </td>
                    <td> 
                        <ul class='btn-list'> 
                            <li> <ion-button @click="incrementAmount(rIndex)" class='dispense-btn' size="large"> + </ion-button> </li>
                            <li> <ion-button @click="decrementAmount(rIndex)" class='dispense-btn' size="large"> - </ion-button> </li>
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
                0,
                0
            ],
            [
                60, 
                1,
                0,
                0
            ],
            [
                90, 
                1,
                0,
                0
            ],
        ]
    }),
    computed: {
        amountNeededRowSpan(): number {
            return this.items.length + 1
        }
    },
    methods: {
        incrementAmount(rIndex: number) {
            const [packSize, _, totalTabs, totalPacks ] = this.items[rIndex]
            const tabsAmount = packSize + totalTabs
            const packAmount = totalPacks + 1
            this.items[rIndex][2] = tabsAmount
            this.items[rIndex][3] = packAmount
        },
        decrementAmount(rIndex: number) {
            const [packSize, _, totalTabs, totalPacks ] = this.items[rIndex]
            const packAmount = totalPacks - 1
            if (packAmount >= 0) {
                const tabsAmount = totalTabs - packSize
                this.items[rIndex][2] = tabsAmount
                this.items[rIndex][3] = packAmount
            }
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
        background-color: rgb(248, 248, 167);
    }
</style>
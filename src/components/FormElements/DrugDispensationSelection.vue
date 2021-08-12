<template>
    <view-port>
        <div class='view-port-content'>
            <ion-row> 
                <ion-col size="2">
                    <nav-button
                        @click="tab='prescribe'"
                        :isActive="tab === 'prescribe'"
                        image='prescription/rx'
                        label='Prescribed'
                    />
                    <nav-button
                        @click="tab='history'"
                        :isActive="tab === 'history'"
                        image='prescription/history'
                        label='History'
                    />             
                </ion-col>
                <ion-col size="10"> 
                    <!--- HISTORY START--->
                    <div class="history" v-if="tab === 'history'"> 
                        <table class="his-table">
                            <tr>
                                <th> Medication</th>
                                <th> Date</th>
                                <th> Amount dispensed </th>
                            </tr>
                            <tr v-for="(history, hindex) in medicationHistory" :key="hindex">
                                <td> {{ history.medication }} </td>
                                <td> {{ history.date }} </td>
                                <td> {{ history.amount }}</td>
                            </tr>
                        </table>
                    </div>
                    <!-- HISTORY END --->

                    <!--- PRESCRIPTION START --->
                    <div class="prescription-tab" v-if="tab === 'prescribe'">
                        <div class='prescription-table-section'> 
                            <table>
                                <tr>
                                    <th> Medication</th>
                                    <th> Amount in stock</th>
                                    <th> Amount needed</th>
                                    <th> Amount dispensed </th>
                                    <th> Reset </th>
                                </tr>
                                <tr v-for="(data, index) in listData" :key="index">
                                    <td> {{ data.label }} </td>
                                    <td> {{ data.other.amount_in_stock || '-'}} </td>
                                    <td> {{ data.other.amount_needed }} </td>
                                    <td> <ion-input 
                                            :disabled="data.value > 0" 
                                            :value="data.value" 
                                            @click="data.value <= 0 ? launchDispenser(data) : null" 
                                            class='dosage-input'/> 
                                        </td>
                                    <td> <reset-button 
                                            :disabled="data.value <= 0" 
                                            @click="data.value > 0 ? onReset(data): null"> 
                                        </reset-button> 
                                    </td>
                                </tr>
                            </table>
                        </div> 
                        <div class='barcode-section'> 
                            <barcode @onScan="onScan"/>
                        </div>
                    </div>
                    <!-- PRESCRIPTION END -->
                </ion-col>
            </ion-row>
        </div>
    </view-port>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ViewPort from '../DataViews/ViewPort.vue'
import { modalController } from '@ionic/vue'
import { Option } from '@/components/Forms/FieldInterface'
import Barcode from '@/components/BarcodeInput.vue'
import NavButton from "@/components/Buttons/ActionSideButton.vue"
import ResetButton from "@/components/Buttons/ResetButton.vue"
import ArtDispensationModal from "@/components/DataViews/ArtDispensationModal.vue"

export default defineComponent({
  components: { ViewPort, Barcode, NavButton, ResetButton },
  props: {
    fdata: {
        type: Object as PropType<Record<string, any>>,
        required: true
    },
    onValue: {
        type: Function
    },
    onValueUpdate: {
        type: Function
    },
    config: {
        type: Object
    },
    options: {
        type: Function,
        required: true
    }
  },
  data: () => ({
    tab: 'prescribe',
    listData: [] as any
  }),
  async activated() {
    this.listData = await this.options(this.fdata)
  },
  computed: {
    medicationHistory(): Array<any> {
        if (this.config && this.config.medicationHistory) {
            return this.config.medicationHistory
        }
        return []
    }
  },
  methods: {
    async onScan(barcode: string) {
        const [ drugId, quantity ] = barcode.split('-')
        const data = this.listData.map(async (i: Option) => {
            if (i.other.drug_id === parseInt(drugId)) {
                const value = parseInt(quantity)
                await this.updateOnValue(i, value, false)
            }
            return i
        })
        this.listData = await Promise.all(data)
    },
    async onReset(item: Option) {
        await this.updateOnValue(item, -1)
    },
    async updateOnValue(item: Option, value: any, shouldOnValueCallback=true) {
        if (this.onValue && shouldOnValueCallback) {
            const ok = await this.onValue({
                label: item.label,
                other: item.other,
                value
            })
            if (!ok) return false
        }
        
        item.value = value < 0 ? 0 : value
        item.other['amount_needed'] = value > 0 ? 0 : item.other['amount_needed']
        this.$emit('onValue', item)

        if (this.onValueUpdate) {
            this.listData = await this.onValueUpdate(item, this.listData)
        }
        return true
    },
    buildPackSizeRows(packSizes: Array<number>) {
        return packSizes.map((p: number) => [p, 0, 0, 0])
    },
    async launchDispenser(item: Option) {
        const modal = await modalController.create({
            component: ArtDispensationModal,
            backdropDismiss: false,
            cssClass: 'custom-modal',
            componentProps: {
                drugName: item.label,
                tabsNeeded: item.other.amount_needed,
                items: this.buildPackSizeRows(item.other.pack_sizes),
                onDispense: async (quantity: number) => {
                   const ok = await this.updateOnValue(item, quantity)
                   if (ok) await modalController.dismiss({})
                }
            }
        })
        modal.present()
    }
  }
})
</script>
<style scoped>
    .view-port-content {
        background: white;
        height: 100%;
    }
    .prescription-tab {
        position: relative;
        height: 75vh;
    }
    .prescription-table-section {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 76%;
        overflow-x: auto;
    }
    .barcode-section {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .dosage-input {
        text-align: center;
        font-weight: bold;
        border: solid 1px #ccc;
        height: 50px;
        width: 80%;
        margin: auto;
        background-color: rgb(255, 248, 221);
    }
    table {
        width: 100%;
    }
    td, th {
        border: 1px solid #ccc;
        padding: 0.6em !important;
    }
</style>

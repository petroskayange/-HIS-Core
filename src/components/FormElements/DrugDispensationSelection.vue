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
                            <table class="his-table">
                                <tr>
                                    <th> Medication</th>
                                    <th> Amount in stock</th>
                                    <th> Amount needed</th>
                                    <th> Amount dispensed </th>
                                    <th> Reset </th>
                                </tr>
                                <tr v-for="(data, index) in listData" :key="index">
                                    <td> {{ data.label }} </td>
                                    <td> {{ data.other.amount_in_stock || 'N/A'}} </td>
                                    <td> {{ data.other.amounted_needed }} </td>
                                    <td> <ion-input :value="data.value" @click="launchDispenser(data)" class='dosage-input'/> </td>
                                    <td> <reset-button> </reset-button> </td>
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
    onScan(barcode: string) {
        try {
            const drugId = barcode.split("-")[0];
            const quantity = barcode.split("-")[1];
            this.$emit('onValue', { label: drugId, value: quantity })
        }catch(e) {
            console.warn(e)
        }
    },
    async launchDispenser(item: Option) {
        const modal = await modalController.create({
            component: ArtDispensationModal,
            backdropDismiss: false,
            cssClass: 'custom-modal',
            componentProps: {
                drugName: item.label,
                tabsNeeded: item.other.amounted_needed,
                items: [
                    [30, 0, 0, 0],
                    [60, 0, 0, 0],
                    [90, 0, 0, 0]
                ],
                onDispense: async (quantity: number) => {
                   if (this.onValue) {
                       const ok = await this.onValue({
                           label: item.label, value: quantity
                       })
                       if (!ok) return
                   }
                   item.value = quantity
                   this.$emit('onValue', item)
                   await modalController.dismiss({})
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
        height: 60px;
        width: 100%;
        background-color: rgb(252, 252, 252);
    }
    .his-table > tr > td, th {
        padding: 0.3em !important;
    }
</style>

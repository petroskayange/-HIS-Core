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
                <ion-col class='prescribe' size="10"> 
                    <!--- HISTORY START--->
                    <table v-if="tab === 'history'" class="his-table">
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
                    <!-- HISTORY END --->

                    <!--- PRESCRIPTION START --->
                    <table v-if="tab === 'prescribe'" class="his-table">
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
                            <td> <ion-input :value="data.value" @click="launchKeyPad(data)" class='dosage-input'/> </td>
                            <td> <ion-button color="danger"> Reset </ion-button></td>
                        </tr>
                    </table>
                    <!-- PRESCRIPTION END -->
                </ion-col>
            </ion-row>
            <barcode v-if="tab === 'prescribe'" class="ftn"/>
        </div>
    </view-port>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ViewPort from '../DataViews/ViewPort.vue'
import { modalController } from '@ionic/vue'
import { Option } from '@/components/Forms/FieldInterface'
import KeyPad from '../Keyboard/HisKeypad.vue'
import Barcode from '@/components/BarcodeScan.vue'
import { time } from "ionicons/icons";
import NavButton from "@/components/Buttons/ActionSideButton.vue"

export default defineComponent({
  components: { ViewPort, Barcode, NavButton },
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
    time,
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
    async launchKeyPad(item: Option) {
        const modal = await modalController.create({
            component: KeyPad,
            backdropDismiss: false,
            cssClass: 'keypad-modal',
            componentProps: {
                title: item.label,
                preset: item.value,
                onKeyPress: async (val: string) => {
                    if (this.onValue) {
                        const ok = await this.onValue({
                            label: item.label, value: val
                        })
                        if (!ok) return
                    }
                    item.value = val
                    this.$emit('onValue', item)
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
    }
    .dosage-input {
        text-align: center;
        font-weight: bold;
        border: solid 1px #ccc;
        height: 60px;
        width: 100%;
        background-color: rgb(252, 252, 252);
    }
    .ftn {
        position: absolute;
        bottom: 15px;
        left: 0;
        right: 0;
        width: 80%;
    }
</style>
<template>
    <view-port :showFull="false">
        <div class='view-port-content'>
            <ion-row> 
                <ion-col size="3">
                    <ion-list>
                        <ion-item :detail="true">
                            <ion-icon :icon="time"> </ion-icon>
                            <ion-label> Prescribed </ion-label> 
                        </ion-item>
                        <ion-item :detail="true">
                            <ion-icon :icon="time"> </ion-icon> 
                            <ion-label> History </ion-label> 
                        </ion-item>
                    </ion-list>             
                </ion-col>
                <ion-col size="9"> 
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
                            <td> N/A </td>
                            <td> {{ data.other.amounted_needed }} </td>
                            <td> <ion-input :value="data.value" @click="launchKeyPad(data)" class='dosage-input'/> </td>
                            <td> <ion-button color="danger"> Reset </ion-button></td>
                        </tr>
                    </table>
                </ion-col>
            </ion-row>
        </div>
    </view-port>
    <barcode class="ftn"/>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ViewPort from '../DataViews/ViewPort.vue'
import { modalController } from '@ionic/vue'
import { Option } from '@/components/Forms/FieldInterface'
import KeyPad from '../Keyboard/HisKeypad.vue'
import Barcode from '@/components/BarcodeScan.vue'
import { time } from "ionicons/icons";

export default defineComponent({
  components: { ViewPort, Barcode },
  props: {
    fdata: {
        type: Object as PropType<Record<string, any>>,
        required: true
    },
    options: {
        type: Function,
        required: true
    }
  },
  data: () => ({
    time,
    listData: [] as any
  }),
  watch: {
    listData: {
        handler() {
            this.$emit('onValue', this.listData)
        },
        deep: true,
        immediate: true
    }
  },
  async activated() {
    this.listData = await this.options(this.fdata)
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
                onKeyPress(val: string){
                    item.value = val
                }
            }
        })
        modal.present()
    }
  }
})
</script>
<style scoped>
    td, th {
        border: 1px solid #dddddd;
    }
    .view-port-content {
        background: white;
    }
    .dosage-input {
        text-align: center;
        font-weight: bold;
        border: solid 1px #ccc;
        height: 60px;
        width: 100%;
        background-color: lightgoldenrodyellow;
    }
    .ftn {
        position: absolute;
        bottom: 8px;
        left: 0;
        right: 0;
        width: 95%;
    }
</style>
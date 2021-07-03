<template>
    <view-port>
        <div class='view-port-content'>
            <table class="his-table">
                <tr>
                    <th> Medication</th>
                    <th> 
                        <ion-img class='ico' :src="img('morning')"/>
                        Morning 
                    </th>
                    <th> 
                        <ion-img class='ico' :src="img('noon')"/>
                        Noon
                    </th>
                    <th> 
                        <ion-img class='ico' :src="img('evening')"/>
                        Evening 
                    </th>
                    <th> 
                        <ion-img class='ico' :src="img('frequency')"/>
                        Frequency 
                    </th>
                </tr>
                <tr v-for="(data, index) in listData" :key="index">
                    <td> {{ data.label }} </td>
                    <td> <ion-input :value="data.other.am" @click="launchKeyPad(data, 'am')" class='dosage-input'/> </td>
                    <td> <ion-input :value="data.other.noon" @click="launchKeyPad(data, 'noon')" class='dosage-input'/> </td>
                    <td> <ion-input :value="data.other.pm" @click="launchKeyPad(data, 'pm')" class='dosage-input'/> </td>
                    <td> 
                        <select v-model="data.other.frequency" class="custom-med-frequency"> 
                            <option value='Weekly (QW)'> Weekly </option>
                            <option value='Daily (QOD)'> Daily  </option>
                        </select> 
                    </td>
                </tr>
            </table>   
        </div>
    </view-port>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ViewPort from '../DataViews/ViewPort.vue'
import { modalController } from '@ionic/vue'
import { Option } from '@/components/Forms/FieldInterface'
import KeyPad from '../Keyboard/HisKeypad.vue'
export default defineComponent({
  components: { ViewPort },
  props: {
    fdata: {
        type: Object as PropType<Record<string, any>>,
        required: true
    },
    options: {
        type: Function,
        required: true
    },
    clear: {
        type: Boolean
    }
  },
  data: () => ({
    listData: [] as any
  }),
  watch: {
    clear: {
        handler(clear: boolean) {
            if(clear) this.onClear(); this.$emit('onClear');
        },
        immediate: true
    }
  },
  async activated() {
    this.listData = await this.options(this.fdata)
  },
  methods: {
    img(name: string) {
        return `assets/images/prescription/${name}.png`
    },
    onClear() {
        this.listData = this.listData.filter((item: Option) => {
            item.other.am = 0
            item.other.noon = 0
            item.other.pm = 0
            item.other.frequency = 'Daily (QOD)'
            return true
        })
    },
    async launchKeyPad(item: Option, prop: string) {
        const modal = await modalController.create({
            component: KeyPad,
            backdropDismiss: false,
            cssClass: 'keypad-modal',
            componentProps: {
                title: item.label,
                preset: item.other[prop],
                onKeyPress(val: string){
                    item.other[prop] = val
                }
            }
        })
        modal.present()
        await modal.onDidDismiss()
        this.$emit('onValue', this.listData)
    }
  }
})
</script>
<style scoped>
    .ico {
        width: 60px;
    }
    .view-port-content {
        height: 100%;
        background: white;
    }
    .dosage-input {
        text-align: center;
        font-weight: bold;
        border: solid 1px #ccc;
        height: 60px;
        width: 7vw;
        background-color: lightgoldenrodyellow;
    }
    .custom-med-frequency {
        width: 100px;
        height: 70px;
        font-size: 1em;
    }
</style>
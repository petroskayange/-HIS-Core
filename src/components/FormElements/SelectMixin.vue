<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import HisKeyboard from "@/components/Keyboard/HisKeyboard.vue"
import handleVirtualInput from "@/components/Keyboard/KbHandler"
import { IonList, IonItem, IonLabel} from "@ionic/vue"
import HisTextInput from "@/components/FormElements/BaseTextInput.vue";
import { Option } from '../Forms/FieldInterface'
import { QWERTY } from "@/components/Keyboard/HisKbConfigurations"
import SelectConfig from "@/components/FormElements/Interfaces/SelectConfig"

export default defineComponent({
    components: { IonList, IonItem, IonLabel, HisTextInput, HisKeyboard },
    props: {
        config: {
            type: Object as PropType<SelectConfig>,
        },
        fdata: {
            type: Object,
            required: true
        },
        clear: {
            type: Boolean
        },
        options: {
            required: true,
            type: Function
        },
    },
    data: () => ({ 
        showKeyboard: true,
        selected: '',
        filter: '',
        keyboard: QWERTY,
        listData: [] as Array<Option>
    }),
    created(){
        if (this.config) {
            if (this.config.showKeyboard === false) {
                this.showKeyboard = false
            }
        }
    },
    computed: {
        filtered(): Array<Option> {
            if (this.filter) {
                return this.listData.filter(item => this.isMatch(item.label, this.filter))
            }
            return this.listData
        }
    },
    methods: {
        isMatch(itemA: string, itemB: string){
            return itemA.match(new RegExp(itemB, 'i')) 
        },
        clearSelection() {
            this.filter = ''
            this.selected = ''
            this.$emit('onClear')
        },
        keypress(text: any){
            if (!this.filter) this.selected = ''

            this.filter = handleVirtualInput(text, this.selected)
            this.selected = this.filter
        }
    }
})
</script>
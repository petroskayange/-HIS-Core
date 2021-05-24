<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import HisKeyboard from "@/components/Keyboard/HisKeyboard.vue"
import handleVirtualInput from "@/components/Keyboard/KbHandler"
import { IonList, IonItem, IonLabel} from "@ionic/vue"
import HisTextInput from "@/components/FormElements/BaseTextInput.vue";
import { Option } from '../Forms/FieldType'

export default defineComponent({
    components: { IonList, IonItem, IonLabel, HisTextInput, HisKeyboard },
    props: {
        clear: {
            type: Boolean
        },
        options: {
            required: true,
            type: Object as PropType<Option[]>
        },
    },
    data: () => ({ 
        selected: '',
        filter: '',
        listData: [] as Array<Option>
    }),
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
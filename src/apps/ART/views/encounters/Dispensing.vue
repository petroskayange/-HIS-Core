<template>
    <his-standard-form :skipSummary="true" :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { DispensationService } from "@/apps/ART/services/dispensation_service"
import EncounterMixinVue from './EncounterMixin.vue'
import Validation from "@/components/Forms/validations/StandardValidations"
import HisDate from "@/utils/Date"

export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        dispensation: {} as any
    }),
    watch: {
        patient: {
            async handler(patient: any){
                this.dispensation = new DispensationService(patient.getID())
                this.fields = this.getFields()
            },
            deep: true
        }
    },
    methods: {
        async onSubmit() {
            //TODO: save something
            this.nextTask()
        },
        getFields(): Array<Field> {
            return [

            ]
        }
    }
})
</script>

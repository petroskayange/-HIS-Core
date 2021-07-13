<template>
    <his-standard-form :cancelDestinationPath="cancelDestination" :fields="fields" @onFinish="onSubmit"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field, Option } from "@/components/Forms/FieldInterface"
import { toastWarning, toastSuccess } from "@/utils/Alerts"
import { AdherenceService } from "@/apps/ART/services/adherence_service"
import EncounterMixinVue from './EncounterMixin.vue'
import Validation from "@/components/Forms/validations/StandardValidations"
import HisDate from "@/utils/Date"
export default defineComponent({
    mixins: [EncounterMixinVue],
    data: () => ({
        adherence: {} as any,
        drugObs: [] as any,
        calculationAgreementObs: [] as any,
        adherenceRows: [] as Array<any>
    }),
    watch: {
        patient: {
            async handler(patient: any){
                if (!patient) return
                this.adherence = new AdherenceService(patient.getID())
                await this.adherence.loadPreviousDrugs()
                this.fields = this.getFields()
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async onSubmit() {
            const encounter = await this.adherence.createEncounter()

            if (!encounter) return toastWarning('Unable to create encounter')

            const data = await Promise.all([...this.drugObs, ...this.calculationAgreementObs])
            const obs = await this.adherence.saveObservationList(data)

            if (!obs) return toastWarning('Unable to save patient observations')

            toastSuccess('Observations and encounter created!')

            this.nextTask()
        },
        buildAdherenceReport(data: any) {
            const lastVisit = this.adherence.getReceiptDate()
            const daysElapsed = this.adherence.calculateDaysElapsed(lastVisit)
            const timeElapse = `
                Last visit: ${HisDate.toStandardHisDisplayFormat(lastVisit)} 
                (${daysElapsed} Days Elapsed)
            `
            const blankRows = data.map(() => '') 
            const columns = [timeElapse, ...data.map(({drug}: any) => drug.name)]
            const rows = [
                ['Prescription', ...blankRows],
                ['Tabs given', ...data.map((i: any) => i.quantity)],
                ['Tabs per day', ...data.map((i: any) => i.equivalent_daily_dose)],
                ['Tabs remaining', ...blankRows],
                ['Expected', ...data.map((i: any) => this.calcPillsExpected(i) < 0 ? 0 : this.calcPillsExpected(i))],
                ['Actual (counted)', ...data.map((i: any) => i.pillsBrought)],
                ['Adherence', ...blankRows],
                ['Doses missed/ Unaccounted for', ...data.map((i: any) => this.calcUnaccountedDoses(i))],
                ['Doses consumed', ...data.map((i: any) => `${this.calcAdherence(i)}%`)],
                ['Art Adherence', ...data.map((i: any) => this.adherenceStatus(i))]
            ]
            return [
                { 
                    label: 'Selected Medication', 
                    value:'Table', 
                    other: { columns, rows }
                }      
            ]
        },
        adherenceStatus(d: any) {
            const adherence = this.calcAdherence(d)
            const isGood = this.adherence.isAdherenceGood(adherence)
            return isGood ? 'Good adherence' : 'Explore problem'
        },
        calcAdherence(d: any) {
            const exp = this.calcPillsExpected(d)
            return this.adherence.calculateAdherence(d.quantity, d.pillsBrought, exp)
        },
        calcUnaccountedDoses(d: any) {
            const exp = this.calcPillsExpected(d)
            return this.adherence.calculateUnaccountedOrMissed(exp, d.pillsBrought)
        },
        calcPillsExpected(d: any) {
            return this.adherence.calculateExpected(
                d.quantity, d.equivalent_daily_dose, d.order.start_date
            )
        },
        getFields(): Array<Field> {
            return [
                {
                    id: 'pills_brought',
                    helpText: 'Pills remaining (brought to clinic)',
                    type: FieldType.TT_ADHERENCE_INPUT,
                    validation: (val: any) => Validation.required(val),
                    summaryMapValue: ({label, value}: Option) => ({ label: `${label}-Amount brought`, value }),
                    unload: async (data: any) => {
                        this.drugObs = []
                        data.forEach(async(val: Option) => {
                            const {drug, order } = val.other
                            const adherence = this.calcAdherence({ ...val.other, pillsBrought: val.value })
                            this.drugObs.push(
                                this.adherence.buildAdherenceObs(order.order_id, drug.drug_id, adherence)
                            )
                            this.drugObs.push(
                                this.adherence.buildPillCountObs(order.order_id, val.value)
                            )
                        })
                    },
                    options: () => {
                        return this.adherence.getLastDrugs().map((data: any) => ({
                            label: data.drug.name,
                            value: '',
                            other: {
                                ...data
                            }
                        }))
                    }
                },
                {
                    id: "adherence_report",
                    helpText: "ART adherence",
                    type: FieldType.TT_TABLE_VIEWER,
                    options: (d: any) => this.buildAdherenceReport(
                        d.pills_brought.map((i: Option) => ({ 
                            ...i.other, pillsBrought: i.value
                        }))
                    )
                },
                {
                    id: "agree_with_calculation",
                    helpText: "Agree with adherence calculation",
                    type: FieldType.TT_SELECT,
                    validation: (val: Option) => Validation.required(val),
                    unload: ({ value }: Option) => {
                        this.calculationAgreementObs = [ this.adherence.buildValueCoded(
                            'Reason for poor treatment adherence', value
                        )]
                    },
                    options: () => [
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' }
                    ]
                }
            ]
        }
    }
})
</script>

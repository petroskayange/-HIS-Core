<script lang="ts">
import { Field, Option } from '@/components/Forms/FieldInterface'
import { defineComponent } from 'vue'
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";

export default defineComponent({
    components: { HisStandardForm },
    data: () => ({
        patient: {} as any,
        fields: [] as Array<Field>,
        form: {} as Record<string, Option> | Record<string, null>,
    }),
    watch: {
       '$route': {
            async handler(route: any){
                if (!route || !route.params.p) return

                const { patient } = JSON.parse(route.params.p.toString())

                this.patient = patient
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        cancelDestination(): string{
            return this.patientDashboardUrl()
        }
    },
    methods: {
        patientDashboardUrl() {
            return `/patient/dashboard/${this.patient.patient_id}`
        },
        gotoPatientDashboard() {
            return this.$router.push({path: this.patientDashboardUrl()}) 
        },
        onFinish(form: Record<string, Option> | Record<string, null>) {
            this.form = form
        }
    }
})
</script>

<script lang="ts">
import { Field, Option } from '@/components/Forms/FieldInterface'
import { defineComponent } from 'vue'
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import {Patientservice} from "@/services/patient_service"

export default defineComponent({
    components: { HisStandardForm },
    data: () => ({
        patient: {} as any,
        programInfo: {} as any,
        fields: [] as Array<Field>,
        form: {} as Record<string, Option> | Record<string, null>,
    }),
    watch: {
       '$route': {
            async handler(route: any){
                if (!route || !route.params.p) return

                const { patient, program } = JSON.parse(route.params.p.toString())

                this.patient = new Patientservice(patient)
                this.programInfo = program
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
            return `/patient/dashboard/${this.patient.getID()}`
        },
        gotoPatientDashboard() {
            return this.$router.push({path: this.patientDashboardUrl()}) 
        },
        nextTask() {
            //TODO: add workflow logic here to navigate to other encounter
            this.gotoPatientDashboard()
        }
    }
})
</script>

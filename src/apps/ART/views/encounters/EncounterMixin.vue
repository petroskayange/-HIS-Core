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
        patientID: '' as any,
        ready: false
    }),
    watch: {
       '$route': {
            async handler(route: any){
                if (!route)  return 
                if(!route.params.p && route.query.patient_id) {
                    this.patientID = route.query.patient_id;
                    const response = await Patientservice.findByID(this.patientID);
                    this.patient = new Patientservice(response);
                    this.ready = true;
                }else {
                    const { patient, program } = JSON.parse(route.params.p.toString())
                    this.patient = new Patientservice(patient)
                    this.patientID = this.patient.getID();
                    this.programInfo = program
                    this.ready = true;
                }
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
            return `/patient/dashboard/${this.patientID}`
        },
        gotoPatientDashboard() {
            return this.$router.push({path: this.patientDashboardUrl()}) 
        },
        nextTask() {
            //TODO: add workflow logic here to navigate to other encounter
            this.gotoPatientDashboard()
        },
        yesNoOptions() {
            return [
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" }
            ]
        },
        yesNoUnknownOptions() {
            return [
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
                { label: "Unknown", value: "Unknown" }
            ]
        },
        resolveObs(obs: any, tag='') {
            let values: Array<any> = []
            Object.values(obs)
                  .filter((d: any) => d.tag === tag || tag === '')
                  .forEach((data: any) => {
                    if (Array.isArray(data.obs)) {
                        values = [...values, ...data.obs]
                    } else {
                        values.push(data.obs)
                    }
                })
            return Promise.all(values)
        },
        validateSeries(conditions: Array<any>){
            try {
                for(const i in conditions) {
                    const condition = conditions[i]()

                    if (condition) return condition
                }
            } catch (e) {
                return [e]
            }
        }
    }
})
</script>

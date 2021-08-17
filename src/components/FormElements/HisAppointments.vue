<template>
  <view-port>
    <div class="view-port-content">
      <ion-grid>
        <ion-row>
          <ion-col size="9">
            <DatePicker
              :min-date="new Date()"
              v-model="startDate"
              is-expanded
              ref="calendar"
              :max-date="runOutDate"
            />
          </ion-col>
          <ion-col size="3">
            <table>
              <tr>
                <td>
                  <tr>
                    <td>Medication Run out Date</td>
                  </tr>
                  <tr>
                    <td>{{ rDate }}</td>
                  </tr>
                </td>
              </tr>
              <tr>
                <td>
                  <tr>
                    <td>User set appointment date</td>
                  </tr>
                  <tr>
                    <td>{{ aDate }}</td>
                  </tr>
                </td>
              </tr>
              <tr>
                <td>
                  <tr>
                    <td>Appointment(s)</td>
                  </tr>
                  <tr>
                    <td>{{ appointments.length }}</td>
                  </tr>
                </td>
              </tr>
              <tr>
                <td>
                  <tr>
                    <td>Appointment limit (per/day)</td>
                  </tr>
                  <tr>
                    <td>{{ appointmentLimit }}</td>
                  </tr>
                </td>
              </tr>
            </table>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </view-port>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import ViewPort from "@/components/DataViews/ViewPort.vue";
import { IonGrid, IonCol, IonRow } from "@ionic/vue";
import { Calendar, DatePicker } from "v-calendar";
import HisDate from "@/utils/Date";
import { AppointmentService } from "@/apps/ART/services/appointment_service";
import { GlobalPropertyService } from "@/services/global_property_service";
export default defineComponent({
  components: { ViewPort, DatePicker, IonGrid, IonCol, IonRow },
  props: {
    options: {
      type: Function,
      required: true,
    },
    fdata: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  watch: {
    startDate: {
      async handler(params: any) {
        this.$emit("onValue", {label: '', value: params});
        if (params) {
          this.getAppointments(params);
        }
      },
      immediate: true,
    },
  },
  data: () => ({
    rows: [],
    startDate: null as any,
    runOutDate: null as any,
    appointments: [],
    appointmentLimit: 0 as any
  }),
  async created() {
    const items = await this.options(this.fdata);
    this.startDate = new Date(items[0].other.appointmentDate);
    const calendar: any = this.$refs.calendar;
    await calendar.move(this.startDate);
    this.getAppointmentLimit();
    this.runOutDate = new Date(items[0].other.runOutDate);
  },
  methods: {
    async getAppointments(date: Date) {
      this.appointments = await AppointmentService.getDailiyAppointments(
        HisDate.toStandardHisFormat(this.aDate)
      );
    },
    async getAppointmentLimit() {
      const limit = await GlobalPropertyService.getAppointmentLimit();
      if(limit) {
        this.appointmentLimit = limit;
      }
    }
  },
  computed: {
    aDate(): string {
      return HisDate.toStandardHisDisplayFormat(this.startDate);
    },
    rDate(): string {
      return HisDate.toStandardHisDisplayFormat(this.runOutDate);
    },
  },
});
</script>
<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  text-align: left;
  padding: 8px;
}
</style>
<template>
    <apexchart width="500" type="bar" :options="options" :series="series"></apexchart>

</template>

<script lang="ts">
import ApiClient from "@/services/api_client"
import moment from 'moment'

export default {
    data: function() {
    return {
      options: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      },
      series: [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }]
    }
  },
  methods: {
        getVisits: async function() {

        const response = await ApiClient.get("/api/v1/programs/1/reports/visits?name=visits&start_date=' + start_date + '&end_date=' + end_date;");

        if (!response || response.status !== 200) return; // NOTE: Targeting Firefox 65, can't `response?.status`

        // const data = await response.json();
        // sessionStorage.sessionDate = data.date;
        // this.fetchLocationName(data.current_health_center_id);
      },
  },
  created: function(){
      console.log(moment());
  }
};
</script>

<style>
</style>
<template>
    <view-port>
        <div class="view-port-content">
            <center> 
            <apexchart
                v-if="series.length >= 1"
                :width="width"
                :type="type"
                :plotOptions="plotOptions"
                :options="chartOptions"
                :series="series"
            ></apexchart>
            </center>
        </div>
  </view-port>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ViewPort from "@/components/DataViews/ViewPort.vue"
export default defineComponent({
   components: { ViewPort },
   props: {
       options: {
            type: Function,
            required: true
       },
       fdata: {
            type: Object as PropType<Record<string, any>>,
            required: true
       }
   },
   data: () => ({
      type: 'area' as string,
      width: '100%' as string,
      series: [] as Array<Record<string, any>>,
      chartOptions: {
        chart: {
          id: "weight_chart",
        },
        title: {
            text: 'Weight trail (2 year period)'
        },
        stroke: {
            curve: 'straight',
        },
        yaxis: {
            title: { text: "Weight Kg(s)"}
        },
        xaxis: {
            categories: []
        },
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            formatter: (firstY: any, opt: any) => {
                const secondY = opt.w.config.series[0].data[opt.dataPointIndex - 1]
                if (secondY && secondY > 0) {
                    return (((firstY/secondY)*100)-100).toFixed(2)+' %';
                }
            }
        },
      },
    }),
    async created() {
        const items = await this.options(this.fdata)
        const data = items[0].other
        this.chartOptions.xaxis.categories = data.labels
        this.series = [
            {
                name: 'Weight',
                data: data.values
            }
        ]
        this.type = data.type ? data.type : 'area'
        this.width = data.width ? data.width: '90%'
    }
  })
</script>

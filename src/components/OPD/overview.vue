<template>
  <ion-grid>
    <ion-row>
       <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Registered today</ion-card-subtitle>
            <ion-card-title></ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{registeredToday}}
          </ion-card-content>
        </ion-card> 
        <ion-card >
          <ion-card-header>
            <ion-card-subtitle>Returning today</ion-card-subtitle>
            <ion-card-title></ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{returningToday}}
          </ion-card-content>
        </ion-card> 
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Referred today</ion-card-subtitle>
            <ion-card-title></ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{referredToday}}
          </ion-card-content>
        </ion-card> 
        <ion-card style="background-color: yellowgreen;">
          <ion-card-header>
            <ion-card-subtitle>Total</ion-card-subtitle>
            <ion-card-title></ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{total}}
          </ion-card-content>
        </ion-card> 
      </ion-row>
      <ion-row>
        <ion-col>
          <p>New registered , Returning and Referred clients</p>
          <apexchart
            width="100%"
            type="bar"
            :options="options"
            :series="series"
          ></apexchart>
        </ion-col>
        <ion-col>
          <p>Encounters created today</p>
          <apexchart
            width="100%"
            height="90%"
            type="area" 
            :options="options" 
            :series="series2"
          ></apexchart>
        </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { IonGrid, IonRow, IonCol } from "@ionic/vue";
import { defineComponent } from "vue";
import ApiClient from "@/services/api_client";
import dayjs from "dayjs";

export default defineComponent({
  data: function () {
    return {
      dayjs,
      startDate: "",
      endDate: "",
      options: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: ["", "", "", "", "","", "", "", "", "", "", ""],
        },
      },
  
      series2: [
        {
          name: "Influenza Like Illness ",
          data: [0, 0, 0, 0, 0,0, 0, 0, 0, 0,0,0],
        },
        {
          name: "Respiratory",
          data: [0, 0, 0, 0, 0,0, 0, 0, 0, 0,0,0],
        },
       
      ],
      series: [
        {
          name: "New",
          data: [0, 0, 0, 0, 0,0, 0, 0, 0, 0,0,0],
        },
        {
          name: "Returning",
          data: [0, 0, 0, 0, 0,0, 0, 0, 0, 0,0,0],
        },
        
        {
          name: "Referred",
          data: [0, 0, 0, 0, 0,0, 0, 0, 0, 0,0,0],
        },
      ],
      rows: [{}],
      encounters: {
        9: "HIV clinic registration",
        51: "HIV reception",
        6: "Vitals",
        52: "HIV staging",
        53: "HIV clinic consultation",
        68: "ART adherence",
        25: "Treatment",
        54: "Dispensing",
        7: "Appointments",
      },
      registeredToday: 0,
      returningToday: 0,
      referredToday: 0,
      total: '',
    };
  },
  components: {
    IonGrid,
    IonRow,
    IonCol,
  },
  mounted() {
    this.endDate = this.dayjs().subtract(1, "days").format("YYYY-MM-DD");
    this.startDate = this.dayjs().subtract(5, "days").format("YYYY-MM-DD");
    this.getVisits();
    // this.getEncounters();
  },
  methods: {
    getVisits: async function () {
      const response = await ApiClient.get(
        `/dashboard_stats?date=${this.startDate}&program_id=14`
      );
      if (response && response.status == 200) {
        const stats = await response.json();

        const topColunm = stats['top'];
        this.registeredToday = topColunm.registered_today;
        this.returningToday = topColunm.returning_today;
        this.referredToday = topColunm.referred_today;
        this.total = topColunm.registered_today + topColunm.returning_today + topColunm.registered_today;
        const dates = [];
        const registered: number[] = [];
        const returning: number[] = [];
        const referred: number[] = [];
        const chartData = stats.down;
        for(let i = 1 ; i <= 12 ; i++)
        {
          const sdate = chartData.registered[i].start_date;
          dates.push(sdate);
        }

        for(let i = 0 ; i < dates.length ; i++)
        {
          for(const name in chartData){
            const attr = chartData[name];
            for(const key in attr){
              const sdate = chartData[name][key].start_date;
              if(sdate != dates[i])
                continue;

              if(name == 'registered')
                registered.push(chartData[name][key].count);
              if(name == 'returning')
                returning.push(chartData[name][key].count);
              if(name == 'referred')
                referred.push(chartData[name][key].count);
            }
          }
        }
        this.series[0].data = [...registered];
        this.series[1].data = [...returning];
        this.series[2].data = [...referred];
        const formattedDays: any[] = dates;
        this.options = {
          ...this.options,
          ...{
            xaxis: {
              categories: [...formattedDays],
            },
          },
        };
        console.log(stats);
      
      }
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
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
ion-card-header + .card-content-md {
    width: 21.4vw;
}
.md.hydrated {
    justify-content: center;
}
 ion-card
 {
   background-color: lightyellow;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
 }
 .ion-inherit-color.md.hydrated {
    font-weight: bold;
    font-size: 18px;
}
</style>
<template>
  <view-port>
    <div class="view-port-content">
      <table>
        <tr>
          <th>Accession #</th>
          <th>Test Name</th>
          <th>Specimen</th>
          <th>Ordered</th>
          <th>Result</th>
          <th>Released</th>
        </tr>
        <tr v-for="(data, index) in rows" :key="index">
          <td>{{ data.accession_number }}</td>
          <td>{{ data.test_name }}</td>
          <td>{{ data.specimen }}</td>
          <td>{{ data.ordered }}</td>
          <td>
            <span v-for="(d, i) in data.result" :key="i"> {{ d }} <br /></span>
          </td>
          <td>{{ data.released }}</td>
        </tr>
      </table>
    </div>
  </view-port>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import ViewPort from "@/components/DataViews/ViewPort.vue";
export default defineComponent({
  components: { ViewPort },
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
  data: () => ({
    rows: [],
  }),
  async created() {
    const items = await this.options(this.fdata);
    this.rows = items[0].other.values;
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
</style>
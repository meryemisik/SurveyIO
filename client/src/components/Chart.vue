<template>
  <div>
    <div>
      <Sidebar :visible.sync="visibleLeft" class="sidebar-list">
        <div class="sidebar-list-item">
          Liste
          <Button
            icon="pi pi-trash"
            class="p-button-text sidebar-list-item-delete"
          />
        </div>
        <div class="sidebar-list-item">
          Liste
          <Button
            icon="pi pi-trash"
            class="p-button-text sidebar-list-item-delete"
          />
        </div>
        <Button
          label="Add Vote"
          class="p-button-success sidebar-list-add-vote"
          @click="addVoteFunction()"
        />
      </Sidebar>
      <Button @click="visibleLeft = true" label="Submit" />
    </div>
    <div class="chart">
      <canvas ref="canvas" id="canvas"></canvas>
      <div class="chart-vote-button">
        <button @click="addVote('a')" :disabled="isButtonDisabled">A</button>
        <button @click="addVote('b')" :disabled="isButtonDisabled">B</button>
        <button @click="addVote('c')" :disabled="isButtonDisabled">C</button>
        <button @click="addVote('d')" :disabled="isButtonDisabled">D</button>
      </div>
    </div>

    <Dialog
      header="Add Vote"
      :visible.sync="addVoteModalVisible"
      class="sidebar-list-add-vote-modal"
    >
      <Dropdown
        v-model="selectedChart"
        :options="charts"
        optionLabel="name"
        placeholder="Select Chart Type"
        @change="changeChartType($event)"
      />

      <div class="chart">
        --- {{ this.newChart[0].chartType }}
        <canvas class="new-chart"></canvas>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
export default {
  name: "Chart",
  sockets: {
    connect: function () {
      console.log("socket connected 2");
    },
    dataSendFront(data) {
      if (this.chartBarx != null) {
        this.chartBarx.destroy();
      }
      this.dataSendChild = data;
      this.chart();
    },
  },
  data() {
    return {
      newChart:[
        {
          chartType:'bubble',
          chartTitle : '',
          chartColumns:[
            {
              label:'',
              bgColor:'',
              borderColor:''
            }
          ]

        }
      ],
      addVoteModalVisible: false,
      visibleLeft: false,
      dataSendChild: null,
      chartBar: null,
      chartBarx:null,
      isButtonDisabled: false,
      selectedChart: null,
      charts: [
        { name: "Bar Chart", type: "bar" },
        { name: "Bubble Chart", type: "bubble" },
        { name: "Doughnut and Pie Charts", type: "doughnut" },
        { name: "Line Chart", type: "line" },
        { name: "Polar Area Chart", type: "polarArea" },
        { name: "Radar Chart", type: "radar" },
        { name: "Scatter Chart", codtypee: "scatter" },
      ],
    };
  },

  methods: {
    chart() {
      var ctx = document.getElementById("canvas").getContext("2d");
      this.chartBar = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["A", "B", "C", "D"],
          datasets: [
            {
              label: "Mat Vote",
              data: Object.values(this.dataSendChild),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(75, 192, 192, 0.2)",
              ],
              borderColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(153, 102, 255)",
                "rgb(75, 192, 192)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          onClick: (e) => {
            var points = e.chart.getElementsAtEventForMode(
              e,
              "nearest",
              { intersect: true },
              true
            );
            if (points.length) {
              const firstPoint = points[0];
              var label = e.chart.data.labels[firstPoint.index];
            }
            this.addVote(label);
          },
        },
      });
    },
    addVote(e) {
      this.$socket.emit("voteSendServer", e);
      this.isButtonDisabled = true;
    },
    addVoteFunction() {
      this.visibleLeft = false;
      this.addVoteModalVisible = true;
    },
    changeChartType(e) {
      console.log("e", e.value.type);
      this.newChart[0].chartType = e.value.type

      var ctx = document.getElementsByClassName('new-chart').getContext("2d");
      console.log(this.newChart[0].chartType)
      this.chartBarx = new Chart(ctx, {
        type:this.newChart[0].chartType,
        data: {
          labels: ["Label One", "Label Two"],
          datasets: [
            {
              label: "Your Vote Title",
              data: Object.values(this.dataSendChild),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)"
              ],
              borderColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)"
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          onClick: (e) => {
            var points = e.chart.getElementsAtEventForMode(
              e,
              "nearest",
              { intersect: true },
              true
            );
            if (points.length) {
              const firstPoint = points[0];
              var label = e.chart.data.labels[firstPoint.index];
            }
            this.addVote(label);
          },
        },
      });


    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/chartBar.scss";
@import "../assets/scss/sidebar.scss";
</style>

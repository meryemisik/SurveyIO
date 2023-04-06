<template>
  <div>
    <photoshop
      v-model="colors"
      v-show="visibleColorPicker"
      class="chart-color-picker"
    />

    <div>
      <Sidebar :visible.sync="visibleLeft" class="sidebar-list">

        <div class="sidebar-list-item" v-for="item in dataChartList">
          <span @click="setChart(item)">{{ item.chartTitle }}</span>
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
      <div>
        <Dropdown
          v-model="selectedChart"
          :options="charts"
          optionLabel="name"
          placeholder="Select Chart Type"
          @change="changeChartType($event)"
        />
        <div class="column-style">
          <label>Column Name</label>
          <InputText type="text" class="p-inputtext-sm" />
          <div class="select-color" @click="changeColumnsColor"></div>
        </div>
      </div>

      <div class="chart-modal">
        <canvas width="250px" ref="canvasModal" id="canvasModal"></canvas>
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
      this.dataChartList = data;
    },
  },
  data() {
    return {
      currentData: 
        {
          chartTitle:'',
          id: null,
          chartType: null,
          labels: [],
          voteCounts: [],
          colors: [],
        },
      visibleColorPicker: false,
      colors: "#194d33",
      newChart: [
        {
          chartType: "bubble",
          chartTitle: "",
          chartColumns: [
            {
              label: "",
              bgColor: "",
              borderColor: "",
            },
          ],
        },
      ],
      addVoteModalVisible: false,
      visibleLeft: false,
      dataChartList: null,
      dataSendChild: null,
      chartBar: null,
      chartBarModal: null,
      isButtonDisabled: false,
      selectedChart: null,
      charts: [
        { name: "Bar Chart", type: "bar" },
        { name: "Bubble Chart", type: "bubble" },
        { name: "Doughnut and Pie Charts", type: "doughnut" },
        { name: "Line Chart", type: "line" },
        { name: "Polar Area Chart", type: "polarArea" },
        { name: "Radar Chart", type: "radar" },
        { name: "Scatter Chart", type: "scatter" },
      ],
    };
  },

  methods: {
    setChart(e) {
        if (this.chartBar != null) {
        this.chartBar.destroy();
      }
      var test = JSON.stringify(e);
      let obj = JSON.parse(test);
      console.log(obj)
      this.currentData = {
        chartTitle : obj.chartTitle,
          id:  obj.id,
          chartType: obj.chartType,
          labels: [],
          voteCounts: [],
          colors: [],
        },
      obj.votingOptions.map((y) => {
        this.currentData.labels.push(y.labelTitle)
        this.currentData.colors.push(y.color)
        this.currentData.voteCounts.push(y.voteCount)
      });
      this.chart()
    },
    changeColumnsColor() {
      this.visibleColorPicker = true;
    },
    chart() {
      var ctx = document.getElementById("canvas").getContext("2d");
      this.chartBar = new Chart(ctx, {
        type:  this.currentData.chartType,
        data: {
          labels: this.currentData.labels,
          datasets: [
            {
              label: this.currentData.chartTitle,
              data: Object.values(this.currentData.voteCounts),
              backgroundColor: this.currentData.colors,
              borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)"],
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
      this.newChart[0].chartType = e.value.type;
      if (this.chartBarModal != null) {
        this.chartBarModal.destroy();
      }
      var ctxModal = document.getElementById("canvasModal").getContext("2d");
      this.chartBarModal = new Chart(ctxModal, {
        type: this.newChart[0].chartType,
        data: {
          labels: ["Ax", "Bx"],
          datasets: [
            {
              label: "Your Vote Title",
              data: Object.values(this.dataSendChild),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)"],
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

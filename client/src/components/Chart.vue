<template>
  <div class="chart">
    <canvas ref="canvas" id="canvas"></canvas>
    <div class="chart-vote-button">
      <button @click="addVote('a')" :disabled="isButtonDisabled">A</button>
      <button @click="addVote('b')" :disabled="isButtonDisabled">B</button>
      <button @click="addVote('c')" :disabled="isButtonDisabled">C</button>
      <button @click="addVote('d')" :disabled="isButtonDisabled">D</button>
    </div>
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
      if (this.chartBar != null) {
        this.chartBar.destroy();
      }
      this.dataSendChild = data;
      this.chart();
    },
  },
  data() {
    return {
      dataSendChild: null,
      chartBar: null,
      isButtonDisabled: false,
    };
  },

  methods: {
    chart() {
      console.log("obje value", Object.values(this.dataSendChild));
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
  },
};
</script>

<style lang="scss">
@import '../assets/scss/chartBar.scss';
</style>

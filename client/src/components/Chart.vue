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
      isButtonDisabled:false
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
        },
      });
    },
    addVote(e) {
      this.$socket.emit("voteSendServer", e);
      this.isButtonDisabled=true
    },
  },
};
</script>

<style>
.chart {
  width: 600px;
  aspect-ratio: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.chart-vote-button {
  width: 100%;
  display: flex;
  /* gap: 20px; */
  justify-content: space-around;
  padding-left: 30px;
  box-sizing: border-box;
}
.chart-vote-button button {
  margin-top: 20px;
  width: 14%;
  padding:5px 0;
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
}
.chart-vote-button button:disabled{
  opacity: .5;
  cursor: not-allowed;
}
.chart-vote-button button:nth-child(1) {
  background: rgba(255, 99, 132, 0.2);
  border-color: rgb(255, 99, 132) !important;
  color: rgb(255, 99, 132);
}
.chart-vote-button button:nth-child(2) {
  background: rgba(255, 159, 64, 0.2);
  border-color: rgb(255, 159, 64) !important;
  color: rgb(255, 159, 64);
}
.chart-vote-button button:nth-child(3) {
  background: rgba(153, 102, 255, 0.2);
  border-color: rgb(153, 102, 255) !important;
  color: rgb(153, 102, 255);
}
.chart-vote-button button:nth-child(4) {
  background: rgba(75, 192, 192, 0.2);
  border-color: rgb(75, 192, 192) !important;
  color: rgb(75, 192, 192);
}
</style>

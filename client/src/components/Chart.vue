<template>
  <div class="dashboard">
    <div class="dashboard-header"></div>
    <div class="dashboard-content mt-5">
      <Card class="chart mt-5">
        <template #title> {{ currentData.chartTitle }} </template>
        <template #content>
          <div class="chart">
            <canvas ref="canvas" id="canvas"></canvas>
            <div class="chart-vote-button">
              <div class="chart-vote-button-list" v-for="(item,index) in currentData.labels" :key="index">
                <button v-if="currentData.labels != []" @click="addVote(item, currentData.id)" :style="{'background-color':currentData.colors[index], 'color':currentData.borderColors[index], 'border-color':currentData.borderColors[index]}">
                  {{ item }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="dashboard-list">
      <h4 class="dashboard-list-header">Chart List</h4>
      <div class="dashboard-list-item" v-for="item in dataChartList">
        <span @click="setChart(item.id)">{{ item.chartTitle }}</span>
        <Button icon="pi pi-trash" class="p-button-text sidebar-list-item-delete" />
      </div>
      <Button label="Create a Survey" class="p-button-success sidebar-list-add-vote" @click="createSurvey()" />
    </div>

    <Dialog header="Add Survey" :visible.sync="addVoteModalVisible" class="sidebar-list-add-vote-modal">
      <div>
        <Dropdown v-model="selectedChart" :options="charts" optionLabel="name" placeholder="Select Chart Type"
          @change="changeChartType(selectedChart)" />
        <div class="label-columns" v-if="selectedChart">
          <label>Chart Title</label>
          <div class="label-columns-item">
            <InputText type="text" class="p-inputtext-sm" v-model="newChartTitle"
              @blur="changeChartTitle(newChartTitle)" />
          </div>

          <label>Columns & Background</label>
          <div class="label-columns-item" v-for="(item, index) in newChart[0].votingOptions " :key="index">
            <InputText type="text" class="p-inputtext-sm" @blur="changeLabelName"
              v-model.trim="newChart[0].votingOptions[index].labelTitle" />
            <ColorPicker v-model="color[index]" format="rgb"/>
            <Button icon="pi pi-trash" @click="deleteNewChartColumn(index)" v-show="newChart[0].votingOptions.length>2"/>
          </div>
          <Button @click="newCreateChartColumn()" label="Create New Column" />
          <Button @click="newChartSetData()" label="Create Chart" :disabled="newChartSetDataVisible" />
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
      this.setChart(this.activeChartId);
    },
  },
  data() {
    return {
      newChartSetDataVisible:true,
      newChartTitle: null,
      newChartLabelName: [],
      newChartColumnBgColor: [],
      newChartColumnBorderColor: [],
      newChartColumnScore: [],
      visibleColorPicker: false,
      color: [{ r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255) },{ r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255) }],
      activeChartId: null,
      currentData: {
        chartTitle: "",
        id: null,
        chartType: null,
        labels: [],
        voteCounts: [],
        colors: [],
        borderColors: [],
      },
      newChart: [
        {
          chartType: "bar",
          chartTitle: "",
          votingOptions: [
            {
              labelTitle: "First Title",
              bgColor: "",
              borderColor: "",
              voteCount: 0
            },
            {
              labelTitle: "Second Title",
              bgColor: "",
              borderColor: "",
              voteCount: 0
            },
          ],
        },
      ],
      addVoteModalVisible: false,
      visibleLeft: false,
      dataChartList: null,
      chartBar: null,
      chartBarModal: null,
      isButtonDisabled: false,
      selectedChart: { name: "Bar Chart", type: "bar" },
      charts: [
        { name: "Bar Chart", type: "bar" },
        { name: "Line Chart", type: "line" },
        { name: "Pie Chart", type: "pie" },
      ],
    };
  },

  methods: {
    deleteNewChartColumn(index){
      this.newChart[0].votingOptions.splice(index,1)
      this.color.splice(index,1)
      this.getNewChartData()
    },
    newCreateChartColumn() {
      this.newChart[0].votingOptions.push({
        labelTitle: 'example name',
         bgColor : "",
         borderColor:"",
         voteCount:0
      });
      this.color.push({ r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255) })
      this.getNewChartData();
    },
    getNewChartData() {
      this.color.map((x,index)=>{
        this.newChart[0].votingOptions[index].bgColor = `rgb(${x.r} ${x.g} ${x.b} / 50%)`,
        this.newChart[0].votingOptions[index].borderColor = `rgb(${x.r} ${x.g} ${x.b} / 100%)`
      })
      this.newChartLabelName = [];
      this.newChartColumnBgColor = [];
      this.newChartColumnBorderColor = [];
      this.newChartColumnScore = [];
      this.newChart[0].votingOptions.map((x) => {
        this.newChartLabelName.push(x.labelTitle);
        this.newChartColumnBgColor.push(x.bgColor);
        this.newChartColumnBorderColor.push(x.borderColor);
        this.newChartColumnScore.push(1)
      });
      this.createNewChart();
    },
    changeLabelName() {
      this.getNewChartData();
    },
    changeChartTitle(e) {
      if(e){
        this.newChartSetDataVisible = false
      }
      else{
        this.newChartSetDataVisible = true
      }
      this.newChart[0].chartTitle = e
      this.createNewChart();
    },
    setChart(e) {
      if (e) {
        this.activeChartId = e;
        var currentChart = {};
        this.dataChartList.findIndex(checkChart);
        function checkChart(chart) {
          if (chart.id == e) {
            currentChart = chart;
            return chart;
          }
        }
        if (this.chartBar != null) {
          this.chartBar.destroy();
        }
        var test = JSON.stringify(currentChart);
        let obj = JSON.parse(test);
        this.currentData = {
          chartTitle: obj.chartTitle,
          id: obj.id,
          chartType: obj.chartType,
          labels: [],
          voteCounts: [],
          colors: [],
          borderColors: [],
        };
        if (obj) {
          obj.votingOptions.map((y) => {
            this.currentData.labels.push(y.labelTitle);
            this.currentData.colors.push(y.bgColor);
            this.currentData.voteCounts.push(y.voteCount);
            this.currentData.borderColors.push(y.borderColor);
          });
          this.chart();
        }
      }
    },
    changeColumnsColor() {
      this.visibleColorPicker = true;
    },
    chart() {
      var ctx = document.getElementById("canvas").getContext("2d");
      this.chartBar = new Chart(ctx, {
        type: this.currentData.chartType,
        data: {
          labels: this.currentData.labels,
          datasets: [
            {
              label: this.currentData.chartTitle,
              data: Object.values(this.currentData.voteCounts),
              backgroundColor: this.currentData.colors,
              borderColor: this.currentData.borderColors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scale: {
            ticks: {
              min: 0,
              precision: 0,
              stepSize: 1,
              beginAtZero: true,
            },
          },

          
        },
      });
    },
    addVote(e, id) {
      this.$socket.emit("voteSendServer", { label: e, id: id });
      this.isButtonDisabled = true;
    },
    newChartSetData() {
      this.$socket.emit('newChartSendServer', 
        this.newChart[0])
    },
    async createSurvey() {
      this.visibleLeft = false;
      this.addVoteModalVisible = true;
      setTimeout(() => {
        this.changeChartType(this.selectedChart);
      }, 500);
    },
    createNewChart() {
      if (this.chartBarModal != null) {
        this.chartBarModal.destroy();
      }
      var ctxModal = document.getElementById("canvasModal").getContext("2d");
      this.chartBarModal = new Chart(ctxModal, {
        type: this.selectedChart.type,
        data: {
          labels: this.newChartLabelName,
          datasets: [
            {
              label: this.newChartTitle
                ? this.newChartTitle
                : "Your Vote Title",
              data: this.newChartColumnScore,
              backgroundColor: this.newChartColumnBgColor,
              borderColor: this.newChartColumnBorderColor,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scale: {
            ticks: {
              precision: 0,
              stepSize: 1,
              beginAtZero: true,
            },
          },
          
        },
      });
    },
    changeChartType(e) {
      if (!!e) {
        if (this.chartBarModal != null) {
          this.chartBarModal.destroy();
        }
        if (this.newChart[0].votingOptions.length > 0) {
          this.getNewChartData();
        }
        this.selectedChart = e;
        this.newChart[0].chartType = e.type;
        this.createNewChart();
      }
    },
  },
  watch: {
    "color"(newValue) {
      this.getNewChartData()
    }}
};
</script>

<style lang="scss">
@import "../assets/scss/chartBar.scss";
@import "../assets/scss/sidebar.scss";
</style>

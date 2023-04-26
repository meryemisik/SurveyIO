<template>
  <div class="dashboard">
    <MegaMenu orientation="horizontal" class="dashboard-header-megamenu">
      <template #start class="dashboard-header">
        <img
          alt="logo"
          src="../image/mat-vote-logo.png"
          class="mr-2 dashboard-header-logo"
        />
      </template>
      <template #end>
        <Button
          label="Create a Survey"
          class="p-button-success sidebar-list-add-vote deneme"
          @click="createSurvey()"
        />
      </template>
    </MegaMenu>

    <div class="dashboard-content">
      <div class="dashboard-chart-header">
        <h2>{{ currentData.chartTitle }}</h2>
        <small class="dashboard-chart-header-date">{{
          formatDate(currentData.createdDate)
        }}</small>
      </div>
      <Card class="chart">
        <template #content>
          <div class="chart">
            <canvas ref="canvas" id="canvas"></canvas>
            <div class="chart-vote-button">
              <div
                class="chart-vote-button-list"
                v-for="(item, index) in currentData.labels"
                :key="index"
              >
                <button
                :disabled="disableVoteButton"
                  v-if="currentData.labels != []"
                  @click="addVote(item, currentData.id)"
                  :style="{
                    'background-color': currentData.colors[index],
                    color: currentData.borderColors[index],
                    'border-color': currentData.borderColors[index],
                  }"
                >
                  {{ item }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <DataTable
        scrollable
        :value="dataChartList"
        resizableRows
        columnResizeMode="fit"
        tableStyle="min-width: 50rem"
        @row-click="clickDataListTableRow($event)"
        class="dashboard-chart-table"
      >
        <Column
          field="chartTitle"
          header="Chart Name"
          sortable
          style="width: 25%"
        ></Column>
        <Column
          field="votingOption"
          header="Total Voting"
          sortable
          style="width: 25%"
        >
          <template #body="slotProps">
            {{ totalVotingValue(slotProps) }}
          </template>
        </Column>
        <Column
          field="quantity"
          header="Total Option"
          sortable
          style="width: 25%"
        >
          <template #body="slotProps">
            {{ slotProps.data.votingOptions.length }}
          </template></Column
        >
        <Column
          field="createdDate"
          header="Create Date"
          sortable
          style="width: 25%"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createdDate) }}
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      header="Add Survey"
      :visible.sync="addVoteModalVisible"
      class="sidebar-list-add-vote-modal"
    >
      <div class="sidebar-list-add-vote-modal-item">
        <div class="label-columns" v-if="selectedChart">
          <div class="label-columns-item">
            <label>Chart Type</label>
            <Dropdown
              v-model="selectedChart"
              :options="charts"
              optionLabel="name"
              placeholder="Select Chart Type"
              @change="changeChartType(selectedChart)"
            />
          </div>
          <div class="chart-title">
            <label>Chart Title</label>
            <div class="chart-title-item">
              <InputText
                type="text"
                class="p-inputtext-sm chart-title-item-input"
                v-model="newChartTitle"
                @blur="changeChartTitle(newChartTitle)"
              />
            </div>
          </div>
        </div>

        <div class="" v-if="selectedChart">
          <label>Columns & Background</label>
          <div class="columns-option">
            <div
              class="columns-option-item"
              v-for="(item, index) in newChart[0].votingOptions"
              :key="index"
            >
              <InputText
                type="text"
                class="p-inputtext-sm"
                @blur="changeLabelName(newChart[0].votingOptions)"
                v-model.trim="newChart[0].votingOptions[index].labelTitle"
              />
              <ColorPicker v-model="color[index]" format="rgb" />
              <Button
                icon="pi pi-trash"
                class="p-button-text sidebar-list-item-delete"
                @click="deleteNewChartColumn(index)"
                v-show="newChart[0].votingOptions.length > 2"
              />
            </div>
          </div>
          <div class="columns-button">
            <Button
              @click="newCreateChartColumn()"
              label="Create New Column"
              class="deneme"
            />
            <Button
              @click="newChartSetData()"
              label="Create Chart"
              :disabled="newChartSetDataVisible"
              class="deneme"
            />
          </div>
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
import moment from "moment";
export default {
  name: "Chart",
  sockets: {
    connect: function () {
      console.log("socket connected 2");
    },
    dataSendFront(data) {
      this.dataChartList = data;

      if (this.dataChartList.length > 0 && this.activeChartId == null) {
        this.activeChartId =
          this.dataChartList[
            Math.floor(Math.random() * this.dataChartList.length)
          ].id;
      }
      this.setChart(this.activeChartId);
    },
    userVoteSendFront(data){
      this.userVoteDataList = data
      this.setChart(this.activeChartId);
    }
  },
  data() {
    return {
      userVoteDataList:[],
      disableVoteButton:false,
      newChartSetDataVisible: true,
      newChartTitle: "Your Survey Title",
      newChartLabelName: [],
      newChartColumnBgColor: [],
      newChartColumnBorderColor: [],
      newChartColumnScore: [],
      visibleColorPicker: false,
      color: [
        {
          r: Math.floor(Math.random() * 255),
          g: Math.floor(Math.random() * 255),
          b: Math.floor(Math.random() * 255),
        },
        {
          r: Math.floor(Math.random() * 255),
          g: Math.floor(Math.random() * 255),
          b: Math.floor(Math.random() * 255),
        },
      ],
      activeChartId: null,
      currentData: {
        chartTitle: "",
        id: null,
        chartType: null,
        labels: [],
        voteCounts: [],
        colors: [],
        borderColors: [],
        createdDate: null,
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
              voteCount: 0,
            },
            {
              labelTitle: "Second Title",
              bgColor: "",
              borderColor: "",
              voteCount: 0,
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
    clickDataListTableRow(e) {
      this.setChart(e.data.id);
    },
    totalVotingValue(e) {
      var totalVoting = 0;
      e.data.votingOptions.map((x) => {
        totalVoting += x.voteCount;
      });
      return totalVoting;
    },
    formatDate(value) {
      return moment(value).format(`DD.MM.YYYY`);
    },
    deleteNewChartColumn(index) {
      this.newChart[0].votingOptions.splice(index, 1);
      this.color.splice(index, 1);
      this.getNewChartData();
    },
    newCreateChartColumn() {
      this.newChart[0].votingOptions.push({
        labelTitle: "example name",
        bgColor: "",
        borderColor: "",
        voteCount: 0,
      });
      this.color.push({
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
      });
      this.getNewChartData();
    },
    getNewChartData() {
      this.color.map((x, index) => {
        (this.newChart[0].votingOptions[
          index
        ].bgColor = `rgba(${x.r} ${x.g} ${x.b} / .3)`),
          (this.newChart[0].votingOptions[
            index
          ].borderColor = `rgba(${x.r} ${x.g} ${x.b} / 1)`);
      });
      this.newChartLabelName = [];
      this.newChartColumnBgColor = [];
      this.newChartColumnBorderColor = [];
      this.newChartColumnScore = [];
      this.newChart[0].votingOptions.map((x) => {
        this.newChartLabelName.push(x.labelTitle);
        this.newChartColumnBgColor.push(x.bgColor);
        this.newChartColumnBorderColor.push(x.borderColor);
        this.newChartColumnScore.push(1);
      });
      this.createNewChart();
    },
    changeLabelName(e) {
      console.log("e", e);
      e.map((x) => {
        console.log("x", x);
      });
      this.getNewChartData();
    },
    changeChartTitle(e) {
      if (e) {
        this.newChartSetDataVisible = false;
      } else {
        this.newChartSetDataVisible = true;
      }
      this.newChart[0].chartTitle = e;
      this.createNewChart();
    },
    setChart(e) {
      if (e) {
        this.disableVoteButton = false
        this.userVoteDataList.filter(x => e == x.surveyId).map((x)=>{
        if(x.userId == localStorage.getItem('phone')){
          this.disableVoteButton = true
        }
      })
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
          createdDate: obj.createdDate,
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
      this.$socket.emit("newUserVote", { selectedOption: e, surveyId: id, userId:'05541693820' })
    },
    newChartSetData() {
      this.$socket.emit("newChartSendServer", this.newChart[0]);
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
                : "Your Survey Title",
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
    color(newValue) {
      this.getNewChartData();
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/chartBar.scss";
@import "../assets/scss/sidebar.scss";
</style>

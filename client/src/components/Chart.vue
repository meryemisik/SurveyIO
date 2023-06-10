<template>
  <div class="dashboard">
    <Header @newChart="this.createSurvey" />
    <Loading v-show="waitingServer" />

    <div class="dashboard-content" v-show="!waitingServer">
      <Panel header="SURVEYS">
        <div class="dashboard-chart-header">
          <h2>{{ currentData.chartTitle }}</h2>
          <small class="dashboard-chart-header-date">{{
            formatDate(currentData.createdDate)
          }}</small>
        </div>

        <div class="chart">
          <template>
            <div class="chart">
              <canvas
                ref="canvas"
                id="canvas"
                v-show="disableVoteButton"
              ></canvas>
              <div class="chart-vote-button">
                <div
                  class="chart-vote-button-list"
                  v-for="(item, index) in currentData.labels"
                  :key="index"
                >
                  <button
                    :class="{ 'selected-vote': selectedUserVoteData == item }"
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
        </div>

        <DataTable
          paginator
          :rows="5"
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
            </template>
          </Column>
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
      </Panel>
    </div>

    <Sidebar
      header="Add Survey"
      :visible.sync="addVoteModalVisible"
      position="right"
      class="sidebar-list-add-vote-modal"
    >
      <span class="sidebar-title">New Chart</span>
      <div class="sidebar-list-item">
        <div class="chart-modal">
          <canvas width="250px" ref="canvasModal" id="canvasModal"></canvas>
        </div>
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

        <div class="label-columns-background" v-if="selectedChart">
          <label>Columns & Background</label>
          <div class="columns-option thin-scrollbar">
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
        </div>
      </div>

      <div class="columns-button">
        <Button @click="newCreateChartColumn()" label="Add Column" />
        <Button
          @click="newChartSetData()"
          label="Create Chart"
          :disabled="newChartSetDataVisible"
        />
      </div>
    </Sidebar>
  </div>
</template>

<script>
import Loading from "./Loading.vue";
import Header from "./Header";
import Chart from "chart.js/auto";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Chart",
  sockets: {
    connect: function () {
      this.waitingServer = false;
    },
    disconnect: function () {
      this.waitingServer = true;
    },
    dataSendFront(data) {
      this.dataChartList = data.surveyList;

      var createActiveChartID =
        this.dataChartList[
          Math.floor(Math.random() * this.dataChartList.length)
        ].id;
      this.setChart(createActiveChartID);
      if (this.dataChartList.length > 0 && this.activeChartId == null) {
        this.activeChartId = createActiveChartID;
      }

      this.userVoteDataList = data.userVote;
    },
  },
  created() {
    document.title = "Vote App | MAT";
  },
  computed: {
    ...mapGetters({
      authUser: "user",
    }),
  },
  data() {
    return {
      waitingServer: true,
      selectedUserVoteData: null,
      userVoteDataList: [],
      disableVoteButton: false,
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
      items: [
        {
          label: this.$store.state.user.phoneNumber,
          items: [
            {
              label: "Create Survey",
              icon: "pi pi-plus",
              command: () => {
                this.createSurvey();
              },
            },
            {
              label: "My Account",
              icon: "pi pi-user",
              to: "/profile",
            },
            {
              label: "Logout",
              icon: "pi pi-sign-out",
              command: () => {
                this.$store.dispatch("logout");
              },
            },
          ],
        },
      ],
    };
  },
  components: {
    Loading,
    Header,
  },
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
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
      //console.log("e", e);
      e.map((x) => {
        //console.log("x", x);
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
      if (e && e !== this.activeChartId) {
        this.disableVoteButton = false;
        if (!!this.authUser.uid) {
          this.userVoteDataList
            .filter((x) => e == x.surveyId)
            .map((x) => {
              if (x.userId == this.authUser.uid) {
                this.disableVoteButton = true;
                this.selectedUserVoteData = x.selectedOption;
              }
            });
        }
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
      if (e != this.selectedUserVoteData) {
        this.$socket.emit("voteSendServer", {
          label: e,
          id: id,
          userId: this.authUser.uid,
        });
      }
    },
    newChartSetData() {
      this.$socket.emit("newChartSendServer", {
        ...this.newChart[0],
        userId: this.authUser.uid,
      });
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

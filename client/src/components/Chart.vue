<template>
  <div class="dashboard">
    <Header />
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
              <div v-show="disableVoteButton">
                <canvas ref="canvas" id="canvas"></canvas>
              </div>
              <div class="chart-vote-button">
                <div class="chart-vote-button-list" v-for="(item, index) in currentData.labels" :key="index">
                  <button :class="{ 'selected-vote': selectedUserVoteData == item }" :disabled="disableVoteButton"
                    v-if="currentData.labels != []" @click="addVote(item, currentData.id)" :style="{
                      'background-color': currentData.colors[index],
                      color: currentData.borderColors[index],
                      'border-color': currentData.borderColors[index],
                    }">
                    {{ item }}
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <DataTable paginator :rows="5" scrollable :value="dataChartList" resizableRows columnResizeMode="fit"
          tableStyle="min-width: 50rem" @row-click="clickDataListTableRow($event)" class="dashboard-chart-table">
          <Column field="chartTitle" header="Chart Name" sortable style="width: 25%"></Column>
          <Column field="votingOption" header="Total Voting" sortable style="width: 25%">
            <template #body="slotProps">
              {{ totalVotingValue(slotProps) }}
            </template>
          </Column>
          <Column field="quantity" header="Total Option" sortable style="width: 25%">
            <template #body="slotProps">
              {{ slotProps.data.votingOptions.length }}
            </template>
          </Column>
          <Column field="createdDate" header="Create Date" sortable style="width: 25%">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.createdDate) }}
            </template>
          </Column>
        </DataTable>
      </Panel>
    </div>

    <Authors/>

  </div>
</template>

<script>
import Loading from "./Loading.vue";
import Header from "./Header";
import Authors from "./Authors.vue";
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
    userLogout() {
      this.$store.dispatch("logout")
    },
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
      dataChartList: null,
      chartBar: null,
    };
  },
  components: {
    Loading,
    Header,
    Authors,
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
  },

};
</script>

<style lang="scss">
@import "../assets/scss/chartBar.scss";
</style>

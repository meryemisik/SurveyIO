<template>
  <div class="profile-page">
    <Header/>


    <div class="profile-page-content">
      <div class="profile-page-content-list">
        <Panel header="PROFILE">
          <TabView>
          <TabPanel header="MY SURVEY LIST">
            <div v-show="chartSurveyListVisible" class="chart-size">
              <canvas ref="canvas" id="canvas"></canvas>
            </div>
            <DataTable
             paginator
             :rows="5" 
              scrollable
              :value="mySurveyList"
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
          </TabPanel>
          <TabPanel header="MY VOTED LIST">
            <div v-show="chartVotedListVisible" class="chart-size">
              <canvas ref="canvasMyVoted" id="canvasMyVoted"></canvas>
            </div>
            <DataTable
            paginator
             :rows="5" 
              scrollable
              :value="myVotedList"
              resizableRows
              columnResizeMode="fit"
              tableStyle="min-width: 50rem"
              @row-click="clickMyVotedListTableRow($event)"
              class="dashboard-chart-table"
            >
              <Column
                field="chartTitle"
                header="Chart Name"
                sortable
                style="width: 25%"
              ></Column>
              <Column
                field="selectedOption"
                header="My Voted"
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
                field="createdDate"
                header="Voted Date"
                sortable
                style="width: 25%"
              >
                <template #body="slotProps">
                  {{ formatDate(slotProps.data.createdDate) }}
                </template>
              </Column>
            </DataTable>
          </TabPanel>
        </TabView>
</Panel>
       
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../../components/Header.vue";
import Chart from "chart.js/auto";
import moment from "moment";
export default {
  name: "Profile",

  data() {
    return {
      mySurveyList: [],
      myVotedList: [],
      chartBar: null,
      chartBarVoted:null,
      chartSurveyListVisible: false,
      chartVotedListVisible:false,
    };
  },
  sockets: {
    dataSendFront(data) {
      data.surveyList
        .filter((e) => e.userId == this.$store.state.user.uid)
        .map((e) => {
          this.mySurveyList.push(e);
        });
      data.userVote
        .filter((e) => e.userId == this.$store.state.user.uid)
        .map((e) => {
          if (
            this.myVotedList.filter((x) => x.surveyId == e.surveyId).length < 1
          ) {
            var userVoteSurveyDetail = data.surveyList.find(
              (x) => x.id == e.surveyId
            );
            this.myVotedList.push({ ...userVoteSurveyDetail, ...e });
          }
        });
    },
  },
  components: {
    Header,
  },
  mounted() {
    if (this.chartBar != null) {
      this.chartBar.destroy();
    }
    this.mySurveyChart();
  },
  methods: {
    mySurveyChart(e) {
      var labels = [];
      var bgColor = [];
      var borderColor = [];
      var voteCount = [];
      if (e) {
        e.votingOptions.map((x) => {
          borderColor.push(x.borderColor);
          bgColor.push(x.bgColor);
          labels.push(x.labelTitle);
          voteCount.push(x.voteCount);
        });
        if (this.chartBar != null) {
          this.chartBar.destroy();
        }
        var ctx = document.getElementById("canvas").getContext("2d");
        this.chartBar = new Chart(ctx, {
          type: e.chartType,
          data: {
            labels: labels,
            datasets: [
              {
                label: e.chartTitle,
                data: voteCount,
                backgroundColor: bgColor,
                borderColor: borderColor,
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
      }
    },
    myVotedChart(e) {
      var labels = [];
      var bgColor = [];
      var borderColor = [];
      var voteCount = [];
      if (e) {
        e.votingOptions.map((x) => {
          borderColor.push(x.borderColor);
          bgColor.push(x.bgColor);
          labels.push(x.labelTitle);
          voteCount.push(x.voteCount);
        });
        if (this.chartBarVoted != null) {
          this.chartBarVoted.destroy();
        }
        var ctx = document.getElementById("canvasMyVoted").getContext("2d");
        this.chartBarVoted = new Chart(ctx, {
          type: e.chartType,
          data: {
            labels: labels,
            datasets: [
              {
                label: e.chartTitle,
                data: voteCount,
                backgroundColor: bgColor,
                borderColor: borderColor,
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
      }
    },
    formatDate(value) {
      return moment(value).format(`DD.MM.YYYY`);
    },
    totalVotingValue(e) {
      var totalVoting = 0;
      e.data.votingOptions.map((x) => {
        totalVoting += x.voteCount;
      });
      return totalVoting;
    },
    clickDataListTableRow(e) {
      this.chartSurveyListVisible = true;
      if (this.chartSurveyListVisible) {
        this.mySurveyChart(e.data);
      }
    },
    clickMyVotedListTableRow(e){
      this.chartVotedListVisible = true;
      if (this.chartVotedListVisible) {
        this.myVotedChart(e.data);
      }
      
    },
  },
};
</script>
<style lang="scss">
@import "../../assets/scss/profile.scss";
</style>

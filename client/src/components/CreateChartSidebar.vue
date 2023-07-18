<template>
  <div>
    <Sidebar header="Add Survey" :visible.sync="addVoteModalVisible" position="right" class="sidebar-list-add-vote-modal">
      <span class="sidebar-title">New Chart</span>
      <div class="sidebar-list-item">
        <div class="chart-modal">
          <canvas width="250px" ref="canvasModal" id="canvasModal"></canvas>
        </div>
        <div class="label-columns" v-if="selectedChart">
          <div class="label-columns-item">
            <label>Chart Type</label>
            <Dropdown v-model="selectedChart" :options="charts" optionLabel="name" placeholder="Select Chart Type"
              @change="changeChartType(selectedChart)" />
          </div>
          <div class="chart-title">
            <label>Chart Title</label>
            <div class="chart-title-item">
              <InputText type="text" class="p-inputtext-sm chart-title-item-input" v-model="newChartTitle"
                @blur="changeChartTitle(newChartTitle)" />
            </div>
          </div>
        </div>

        <div class="label-columns-background" v-if="selectedChart">
          <label>Columns</label>
          <div class="columns-option thin-scrollbar">
            <div class="columns-option-item" v-for="(item, index) in newChart[0].votingOptions" :key="index">
              <InputText type="text" class="p-inputtext-sm" @blur="changeLabelName(newChart[0].votingOptions)"
                v-model.trim="newChart[0].votingOptions[index].labelTitle" />
              <ColorPicker v-model="color[index]" format="rgb" />
              <Button icon="pi pi-trash" class="p-button-text sidebar-list-item-delete"
                @click="deleteNewChartColumn(index)" v-show="newChart[0].votingOptions.length > 2" />
            </div>
          </div>
        </div>
      </div>

      <div class="columns-button">
        <Button @click="newCreateChartColumn()" label="Add Column" v-if="newChart[0].votingOptions.length < 5" />
        <Button @click="newChartSetData()" label="Create Chart" :disabled="newChartSetDataVisible" />
      </div>
    </Sidebar>
  </div>
</template>
  
<script>
import Chart from "chart.js/auto";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CreateChartSidebar",
  data() {
    return {
      charts: [
        { name: "Bar Chart", type: "bar" },
        { name: "Line Chart", type: "line" },
        { name: "Pie Chart", type: "pie" },
      ],
      addVoteModalVisible: false,
      selectedChart: { name: "Bar Chart", type: "bar" },
      newChartSetDataVisible: true,
      newChartTitle: "Your Survey Title",
      newChartLabelName: [],
      newChartColumnBgColor: [],
      newChartColumnBorderColor: [],
      newChartColumnScore: [],
      newChart: [
        {
          chartType: "bar",
          chartTitle: "",
          votingOptions: [
            {
              labelTitle: "Example Title 1",
              bgColor: "",
              borderColor: "",
              voteCount: 0,
            },
            {
              labelTitle: "Example Title 2",
              bgColor: "",
              borderColor: "",
              voteCount: 0,
            },
          ],
        },
      ],
      chartBarModal: null,

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
    };
  },

  methods: {
    async openSidebar() {
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
    changeChartTitle(e) {
      if (e) {
        this.newChartSetDataVisible = false;
      } else {
        this.newChartSetDataVisible = true;
      }
      this.newChart[0].chartTitle = e;
      this.createNewChart();
    },
    deleteNewChartColumn(index) {
      this.newChart[0].votingOptions.splice(index, 1);
      this.color.splice(index, 1);
      this.getNewChartData();
    },
    newCreateChartColumn() {
      const uniqueId = this.newChart[0].votingOptions.length + 1;
      const labelTitle = "Example Title " + uniqueId;

      this.newChart[0].votingOptions.push({
        labelTitle: labelTitle,
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
    changeLabelName(e) {
      //console.log("e", e);
      e.map((x) => {
        //console.log("x", x);
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
    formatDate(value) {
      return moment(value).format(`DD.MM.YYYY`);
    },
    newChartSetData() {
      this.$socket.emit("newChartSendServer", {
        ...this.newChart[0],
        userId: this.authUser.uid,
      });
    },
  },
  computed: {
    ...mapGetters({
      authUser: "user",
    }),
  },
  watch: {
    color(newValue) {
      this.getNewChartData();
    },
  },
};
</script>
  
<style lang="scss">
@import "../assets/scss/sidebar.scss";
</style>
  
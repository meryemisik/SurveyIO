<template>
  <div id="app">
    <Chart />
    <button @click="test">Tıkla </button>
  </div>
</template>

<script>
import Chart from "./components/Chart.vue";
export default {
  name: "App",
  components: {
    Chart,
  },
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    customEmit: function (data) {
      console.log(
        'this method was fired by the socket server. eg: io.emit("customEmit", data)'
      );
    },
  },
  data() {
    return {
      socket: null,
    };
  },
  mounted() {
    this.sockets.subscribe("dataSendFront", function (e) {
      console.log("e", e);
    });
  },
  methods: {
    test() {
      console.log("socket", this.socket);
      this.sockets.emit("voteSendServer", 'mero');
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

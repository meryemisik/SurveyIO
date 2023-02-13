<template>
  <div id="app">
    <Chart />
  </div>
</template>

<script>
import Chart from "./components/Chart.vue";
export default {
  name: "App",
  components: {
    Chart,
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style>
body{
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
  display: flex;
    justify-content: center;
}
</style>

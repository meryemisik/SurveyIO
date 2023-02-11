<template>
  <div>
    <canvas ref="canvas" id="canvas"></canvas>
    <div>
    <button @click="drawRect">Add Rect</button>
    <button @click="subWidth">-</button>
    <button @click="addWidth">+</button>
  </div>
  </div>
</template>

<script>
export default {
  name: "Chart",
  data() {
    return {
      vueCanvas: null,
      rectWidth: 200
    };
  },
  mounted() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    this.vueCanvas = ctx;
    this.drawRect();
  },
  methods: {
    drawRect() {
      // clear canvas
      this.vueCanvas.clearRect(0, 0, 400, 200);
      
      // draw rect
      this.vueCanvas.beginPath();
      this.vueCanvas.rect(20, 20, this.rectWidth, 100);
      this.vueCanvas.stroke();      
    },
    addWidth() {
      this.rectWidth += 10
      this.drawRect()
    },
    subWidth() {
      this.rectWidth -= 10
      this.drawRect()      
    }
  },
};
</script>

<style></style>

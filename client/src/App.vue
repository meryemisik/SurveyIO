<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link>
    </nav>
    <router-view/>
  </div>
</template>


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

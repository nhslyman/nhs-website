<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue"; // @ is an alias to /src

@Component({
  components: {
    Header
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "@/shared-style/variables.scss";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
}
</style>

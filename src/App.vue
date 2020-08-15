<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/marginals/Header.vue";
import Footer from "@/components/marginals/Footer.vue";
import { orgName } from '@/main';

@Component({
  components: {
    Header, Footer
  }
})
export default class App extends Vue {
  orgName = orgName;
  
  beforeCreate() {
    document.title = orgName;
  }
}
</script>

<style lang="scss">
@import "@/shared-style/variables.scss";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  // sticky footer
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

* {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
  word-break: break-word;
}

h1 {
  font-size: 2em;
  line-height: 150%;
  color: $titleColor;
}

h2 {
  font-size: 1.25em;
  line-height: 150%;
  color: $headingColor;
}

a {
  color: $linkColor;

  &:hover {
    color: $hoverLinkColor;
  }
}

ul {
  padding-left: 1.5em;
  line-height: 150%;
}
</style>

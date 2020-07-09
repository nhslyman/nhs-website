<template>
  <div id="home">
    <h1>Lyman NHS Info</h1>
    <div v-html="content" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import marked from "marked";

@Component
export default class Home extends Vue {
  get content() {
    return marked(this.$store.getters["text/homeText"]);
  }
}
</script>

<style lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#home {
  @include std-size;
  @include std-position;
  color: black;

  h2 {
    padding-top: 1.25em;
  }

  p {
    padding: 10px 0;
    line-height: 150%;
  }
}
</style>

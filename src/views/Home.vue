<template>
  <div id="home">
    <h1>Lyman NHS Info</h1>
    <div v-html="content"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import marked from "marked";
import mockContents from "@/mock/home";

@Component
export default class Home extends Vue {
  get content() {
    return marked(mockContents);
  }
}
</script>

<style lang="scss">
@import "@/shared-style/variables.scss";

#home {
  margin-left: auto;
  margin-right: auto;
  padding: 2.5% 25% 10% 25%;
  max-width: 50em;
  color: black;

  h1 {
    font-size: 30px;
    line-height: 150%;
    color: $titleColor;
  }

  h2 {
    padding-top: 1.5em;
    line-height: 150%;
    color: $headingColor;
  }

  p {
    padding: 10px 0;
    line-height: 150%;
  }

  ul {
    padding-left: 2.5em;
    line-height: 150%;
  }

  a {
    color: $linkColor;
  }

  a:hover {
    color: $hoverLinkColor;
  }
}
</style>

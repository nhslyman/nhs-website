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
@import "@/shared-style/mixins.scss";

#home {
  @include box-size;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2.5%;
  margin-bottom: 25%;
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

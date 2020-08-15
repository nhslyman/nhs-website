<template>
  <div id="footer">
    <p>Powered By <a href="https://github.com/liamrosenfeld/OpenHouse">Open House</a></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Footer extends Vue {}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#footer {
  background-color: #dddddd;
  text-align: center;
  margin-top: 4em;
  
  p {
    color: $linkColor;
    padding: 1.5em 0;
    margin: 0;
  }
}
</style>

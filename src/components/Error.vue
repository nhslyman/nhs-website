<template>
  <div id="error-page">
    <h1>{{ code }} Error 🤖</h1>
    <h2>{{ description }}</h2>
    <router-link to="/">Return Home</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ErrorPage extends Vue {
  @Prop() code!: number;
  @Prop() description!: string;
}
</script>

<style lang="scss">
@import "@/shared-style/variables.scss";

#error-page {
  margin-left: auto;
  margin-right: auto;
  padding: 2.5% 25% 10% 25%;
  max-width: 50em;
  color: black;

  h1 {
    font-size: 2.75em;
    color: $titleColor;
  }

  h2 {
    font-size: 1.75em;
    padding-bottom: 10px;
  }
}
</style>

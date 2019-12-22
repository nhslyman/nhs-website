<template>
  <div id="nav">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div class="spacer"></div>
    <router-link to="/">Lyman NHS</router-link>
  </div>
</template>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";

#nav {
  padding: 30px;
  display: flex;
  align-items: center;
  background-color: lightgray;

  a {
    font-size: 30px;
    font-weight: bold;
    color: $headingColor;
    text-decoration: none;
  }

  img {
    max-height: 30px;
  }

  .spacer {
    width: 10px;
  }
}
</style>

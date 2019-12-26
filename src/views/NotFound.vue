<template>
  <div id="not-found">
    <h1>404 Error. 🤖</h1>
    <h2>Page Not Found</h2>
    <router-link to="/">Return Home</router-link>
  </div>
</template>

<style lang="scss">
@import "@/shared-style/variables.scss";

#not-found {
  margin-left: auto;
  margin-right: auto;
  padding: 2.5% 25% 10% 25%;
  max-width: 50em;
  color: black;

  h1 {
    font-size: 40px;
    color: $titleColor;
  }

  h2 {
    font-size: 30px;
    color: $headingColor;
    padding-bottom: 10px;
  }

  a {
    color: $linkColor;
  }

  a:hover {
    color: $hoverLinkColor;
  }
}
</style>

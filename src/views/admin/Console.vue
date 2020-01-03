<template>
  <div id="admin-console">
    <div class="inside">
      <h1>Admin Console</h1>
      <ul>
        <li><router-link to="/admin/events">Manage Events</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AdminConsole extends Vue {}
</script>

<style lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#admin-console {
  @include std-size;
  @include shadow-box;
  @include std-position;
  color: black;

  h1 {
    font-size: 30px;
    line-height: 150%;
    color: $titleColor;
  }

  ul {
    padding-left: 2.5em;
    font-size: 1.2em;
    line-height: 150%;
  }

  a {
    color: $linkColor;
    text-decoration: none;
  }

  a:hover {
    color: $hoverLinkColor;
  }
}
</style>

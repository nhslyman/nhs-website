<template>
  <div id="admin-console">
    <div class="inside">
      <h1>Admin Console</h1>
      <ul>
        <li>
          <router-link to="/admin/events">
            Manage Events
          </router-link>
        </li>
        <li>
          <router-link to="/admin/home">
            Manage Home
          </router-link>
        </li>
        <li>
          <router-link to="/admin/users">
            Manage Users
          </router-link>
        </li>
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
  @include skinny-size;
  @include shadow-box;
  @include std-position;
  color: black;

  ul {
    font-size: 1.2em;
  }

  a {
    text-decoration: none;
  }
}
</style>

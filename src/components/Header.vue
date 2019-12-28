<template>
  <div id="nav">
    <div id="inside">
      <div id="logo">
        <img alt="Lyman NHS Logo" src="../assets/logo.png" />
        <router-link to="/">
          <h1>Lyman NHS</h1>
        </router-link>
      </div>
      <div id="user">
        <template v-if="loggedIn">
          <div class="dropdown">
            <div id="name">
              <template v-if="attributes != null">
                <p>{{ attributes.fullName }}</p>
              </template>
              <template v-else>
                <p>Account</p>
              </template>
            </div>
            <div class="dropdown-content">
              <router-link to="user">Manage Account</router-link>
              <button @click="signOut">Sign out</button>
            </div>
          </div>
        </template>
        <template v-else>
          <p>
            <router-link to="login">Login</router-link>
            <span> or </span>
            <router-link to="register">Register</router-link>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
import UserAttributes from "@/models/UserAttributes.ts";

@Component
export default class Header extends Vue {
  @Getter("loggedIn") loggedIn!: boolean;

  get attributes() {
    // for some reason using vuex-class with this is always undefined
    return this.$store.state.user.attributes;
  }

  signOut() {
    this.$store.dispatch("signOut").then(() => {
      if (this.$route.path != "/") {
        this.$router.push("/");
      }
    });
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";

#nav {
  background-color: #dddddd;

  #inside {
    padding: 20px;
    display: flex;
    align-items: center;
  }

  #logo {
    display: flex;
    float: left;
    align-items: center;
  }

  h1 {
    padding-left: 0.4em;
    display: inline;
    font-size: 30px;
    font-weight: bold;
    color: $titleColor;
  }

  a {
    text-decoration: none;
    color: $linkColor;

    &:hover {
      color: $hoverLinkColor;
    }
  }

  img {
    max-height: 50px;
  }

  #user {
    display: flex;
    margin-left: auto;

    #name {
      color: $headingColor;
      padding: 16px;
      font-size: 16px;
      border: none;
      cursor: pointer;

      &:hover {
        color: $titleColor;
      }
    }

    .dropdown {
      position: relative;
      display: inline-block;
      // float: right;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      right: 0;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;
    }

    .dropdown-content * {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      width: 100%;
    }

    .dropdown-content *:hover {
      background-color: #f1f1f1;
    }

    .dropdown:hover .dropdown-content {
      display: block;
    }

    p {
      font-size: 1.5em;
    }
  }
}
</style>

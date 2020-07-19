<template>
  <div id="nav">
    <div id="inside">
      <img
        id="logo"
        alt="Lyman NHS Logo"
        src="../assets/logo.svg"
      >
      <div id="links">
        <router-link to="/">
          <p>Home</p>
        </router-link>
        <router-link to="/events">
          <p>Events</p>
        </router-link>
        <router-link
          v-if="admin"
          to="/admin"
        >
          Admin Console
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
              <router-link
                v-if="admin"
                to="/events/past"
              >
                Your Past Events
              </router-link>
              <router-link to="/user">
                Manage Account
              </router-link>
              <button @click="signOut">
                Sign out
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <p>
            <router-link to="/login">
              Login
            </router-link>
            <span> or </span>
            <router-link to="/register">
              Register
            </router-link>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UserAttributes } from "@/models";

@Component
export default class Header extends Vue {
  get loggedIn(): boolean {
    return this.$store.getters["user/loggedIn"];
  }

  get admin(): boolean {
    if (this.attributes == null) {
      return false;
    }
    return this.attributes.admin;
  }

  get attributes(): UserAttributes | null {
    return this.$store.state.user.attributes;
  }

  signOut() {
    this.$store.dispatch("user/signOut").then(() => {
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

  a {
    text-decoration: none;
  }

  #inside {
    padding: 1.5em 0.25em;
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: space-between;
    flex-direction: column;

    @media (min-width: $maxMobileSize) {
      flex-direction: row;
      padding: 1.5em 2.5em;
    }
  }

  #logo {
    max-height: 3em;
  }

  #links {
    display: flex;
    flex-direction: row;

    a {
      font-size: 1.2em;
      padding: 0 0.75em;
    }
  }

  #user {
    display: flex;

    #name {
      color: $headingColor;
      padding: 0.15em 0;
      font-size: 0.85em;
      border: none;
      cursor: pointer;

      &:hover {
        color: $titleColor;
      }
    }

    .dropdown {
      position: relative;
      display: inline-block;
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

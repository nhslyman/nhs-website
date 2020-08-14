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
          v-if="loggedIn && admin"
          to="/admin"
        >
          <p>Admin Console</p>
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
                class="dropdown-item"
                to="/events/past"
              >
                Your Past Events
              </router-link>
              <router-link
                class="dropdown-item"
                to="/user"
              >
                Manage Account
              </router-link>
              <a
                class="dropdown-item"
                @click="signOut"
              >
                Sign out
              </a>
            </div>
          </div>
        </template>
        <template v-else>
          <p id="logged-out">
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
    align-items: center;

    a {
      font-size: 1.4em;
      padding: 0 0.75em;
    }
  }

  #logged-out {
    display: flex;
    flex-direction: row;
    align-items: center;

    a {
      font-size: 1.4em;
      padding: 0 0.5em;
    }
  }

  #user {
    display: flex;

    #name {
      color: $headingColor;
      padding: 0.15em 0;
      font-size: 1.25em;
      border: none;
      cursor: pointer;

      &:hover {
        color: $titleColor;
      }
    }

    .dropdown {
      position: relative;
      display: inline-block;

      &:hover .dropdown-content {
        display: block;
      }
    }

    .dropdown-content {
      display: none;
      position: absolute;
      right: 0;
      background-color: #f9f9f9;
      min-width: 170px;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;
    }

    .dropdown-item {
      font-size: 1em;
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      text-align: center;

      &:hover {
        background-color: #f1f1f1;
      }
    }
  }
}
</style>

<template>
  <div id="login">
    <div class="inside">
      <h1>Login</h1>
      <form action="#" @submit.prevent="submit">
        <div class="group">
          <label for="email">
            Email
          </label>

          <div>
            <input
              type="email"
              class="form-control"
              name="email"
              autocomplete="email"
              placeholder="Email"
              required
              autofocus
              v-model="form.email"
            />
          </div>
        </div>

        <div class="group">
          <label for="password">
            Password
          </label>

          <div>
            <input
              type="password"
              class="form-control"
              name="current-password"
              autocomplete="current-password"
              placeholder="Password"
              required
              v-model="form.password"
            />
          </div>
        </div>

        <div>
          <button type="submit" class="submit">
            <p>Login</p>
          </button>
        </div>
      </form>

      <div id="toNew">
        <router-link to="/register">
          <p>New Here? Create a new account</p>
        </router-link>
      </div>

      <div v-if="error != ''" class="error">
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  // form handling
  form = {
    email: "",
    password: ""
  };

  error: string = "";

  async submit() {
    this.error = "";
    try {
      await this.$store.dispatch("user/signIn", {
        email: this.form.email,
        password: this.form.password
      });
      this.$router.push("/");
    } catch (err) {
      this.error = "Invalid Username/Password";
    }
  }

  // go back to home if already logged in
  get loggedIn(): boolean {
    return this.$store.getters["user/loggedIn"];
  }

  mounted() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  }

  @Watch("this.loggedIn")
  loginChanged(loggedIn: boolean) {
    if (loggedIn) {
      this.$router.push("/");
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#login {
  @include shadow-box;
  @include form;
  @include std-size;
  @include std-position;

  #toNew {
    margin-top: 0.5em;
    a {
      color: $linkColor;

      &:hover {
        color: $hoverLinkColor;
      }
    }
  }
}
</style>

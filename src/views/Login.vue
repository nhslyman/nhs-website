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
              id="email"
              type="email"
              class="form-control"
              name="email"
              placeholder="Email"
              value
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
              id="password"
              type="password"
              class="form-control"
              name="password"
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

      <div v-if="error != ''" class="alert">
        <div>{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import firebase from "firebase";

@Component
export default class Login extends Vue {
  form = {
    email: "",
    password: ""
  };

  error: String = "";

  submit() {
    this.error = "";
    firebase
      .auth()
      .signInWithEmailAndPassword(this.form.email, this.form.password)
      .then(() => {
        this.$router.push("/");
      })
      .catch(err => {
        this.error = "Invalid Username/Password";
      });
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#login {
  @include shadow-box;
  @include form;
  width: 40%;
  margin-top: 3em;
  margin-left: auto;
  margin-right: auto;

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

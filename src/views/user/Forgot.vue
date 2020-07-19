<template>
  <div id="forgot">
    <div class="inside">
      <h1>Forgot Password</h1>
      <form
        action="#"
        @submit.prevent="submit"
      >
        <div class="group">
          <label for="email">
            Email
          </label>

          <div>
            <input
              v-model="email"
              type="email"
              class="form-control"
              name="email"
              autocomplete="email"
              placeholder="Email"
              required
              autofocus
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="submit"
          >
            <p>Send Email</p>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase/app";

@Component
export default class Login extends Vue {
  // form handling
  email = "";

  submit() {
    let auth = firebase.auth();
    auth
      .sendPasswordResetEmail(this.email)
      .then(() => {
        this.$toaster.success("Password Reset Email Sent!")
      })
      .catch((err) => {
        this.$toaster.error(err.message)
      });
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#forgot {
  @include shadow-box;
  @include form;
  @include std-size;
  @include std-position;
}
</style>

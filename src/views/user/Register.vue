<template>
  <div id="register">
    <div class="inside">
      <h1>Register</h1>
      <form
        action="#"
        @submit.prevent="submit"
      >
        <div class="group">
          <label for="firstName">
            First Name
          </label>

          <div>
            <input
              v-model="form.firstName"
              type="text"
              class="form-control"
              name="first-name"
              autocomplete="given-name"
              placeholder="First Name"
              required
              autofocus
            >
          </div>
        </div>

        <div class="group">
          <label for="lastName">
            Last Name
          </label>

          <div>
            <input
              v-model="form.lastName"
              type="text"
              class="form-control"
              name="last-name"
              autocomplete="family-name"
              placeholder="Last Name"
              required
            >
          </div>
        </div>

        <div class="group">
          <label for="email">
            Email
          </label>

          <div>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              name="email"
              autocomplete="email"
              placeholder="Email"
              required
            >
          </div>
        </div>

        <div class="group">
          <label for="password">
            Password
          </label>

          <div>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              name="password"
              autocomplete="new-password"
              placeholder="Password"
              required
            >
          </div>
        </div>

        <div class="group">
          <label for="comfirmPassword">
            Comfirm Password
          </label>

          <div>
            <input
              v-model="form.comfirmPassword"
              type="password"
              class="form-control"
              name="comfirmPassword"
              autocomplete="new-password"
              placeholder="Comfirm Password"
              required
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="submit"
          >
            <p>Register</p>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class Register extends Vue {
  // form handling
  form = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    comfirmPassword: ""
  };

  error: string = "";

  async submit() {
    this.error = "";

    if (this.form.password != this.form.comfirmPassword) {
      this.error = "Passwords do not match";
      return;
    }

    try {
      await this.$store.dispatch("user/registerUser", {
        email: this.form.email,
        password: this.form.password,
        firstName: this.form.firstName,
        lastName: this.form.lastName
      });
      
      this.$toaster.success("Account created! Check your email to verify your account.")

      this.$router.push("/");
    } catch (err) {
      this.$toaster.error(err.message)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#register {
  @include shadow-box;
  @include form;
  @include std-size;
  @include std-position;
}
</style>

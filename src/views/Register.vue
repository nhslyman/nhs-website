<template>
  <div id="register">
    <div class="inside">
      <h1>Register</h1>
      <form action="#" @submit.prevent="submit">
        <div class="group">
          <label for="firstName">
            First Name
          </label>

          <div>
            <input
              type="text"
              class="form-control"
              name="first-name"
              autocomplete="given-name"
              placeholder="First Name"
              required
              autofocus
              v-model="form.firstName"
            />
          </div>
        </div>

        <div class="group">
          <label for="lastName">
            Last Name
          </label>

          <div>
            <input
              type="text"
              class="form-control"
              name="last-name"
              autocomplete="family-name"
              placeholder="Last Name"
              required
              v-model="form.lastName"
            />
          </div>
        </div>

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
              name="password"
              autocomplete="new-password"
              placeholder="Password"
              required
              v-model="form.password"
            />
          </div>
        </div>

        <div class="group">
          <label for="comfirmPassword">
            Comfirm Password
          </label>

          <div>
            <input
              type="password"
              class="form-control"
              name="comfirmPassword"
              autocomplete="new-password"
              placeholder="Comfirm Password"
              required
              v-model="form.comfirmPassword"
            />
          </div>
        </div>

        <div>
          <button type="submit" class="submit">
            <p>Register</p>
          </button>
        </div>
      </form>

      <div v-if="error != ''" class="alert">
        <div>{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Register extends Vue {
  form = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    comfirmPassword: ""
  };

  error: String = "";

  submit() {
    this.error = "";

    if (this.form.password != this.form.comfirmPassword) {
      this.error = "Passwords do not match";
      return;
    }

    this.$store
      .dispatch("registerUser", {
        email: this.form.email,
        password: this.form.password,
        firstName: this.form.firstName,
        lastName: this.form.lastName
      })
      .then(() => {
        this.$router.push("/");
      })
      .catch(err => {
        this.error = err.message;
      });
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#register {
  @include shadow-box;
  @include form;
  width: 40%;
  margin-top: 3em;
  margin-left: auto;
  margin-right: auto;
}
</style>

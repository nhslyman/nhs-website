<template>
  <div id="register">
    <div class="inside">
      <h1>Register</h1>
      <form action="#" @submit.prevent="submit">
        <div class="group">
          <label for="name">
            Name
          </label>

          <div>
            <input
              id="name"
              type="name"
              class="form-control"
              name="name"
              placeholder="Name"
              value
              required
              autofocus
              v-model="form.name"
            />
          </div>
        </div>

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

        <div class="group">
          <label for="comfirmPassword">
            Comfirm Password
          </label>

          <div>
            <input
              id="comfirmPassword"
              type="password"
              class="form-control"
              name="comfirmPassword"
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
import firebase from "firebase/app";

@Component
export default class Register extends Vue {
  form = {
    name: "",
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

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.form.email, this.form.password)
      .then(data => {
        if (data.user === null) {
          throw new Error(
            "Account Registration Failed. Please Contact Support."
          );
        }
        data.user
          .updateProfile({
            displayName: this.form.name
          })
          .then(() => {
            this.$router.push("/");
          });
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

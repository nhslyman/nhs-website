<template>
  <div id="register">
    <div class="inside">
      <h1>Manage Account Info</h1>
      <form action="#" @submit.prevent="updateName">
        <h2>Edit Name</h2>
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
              v-model="name.first"
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
              v-model="name.last"
            />
          </div>
        </div>

        <div>
          <button type="submit" class="submit">
            <p>Update</p>
          </button>
        </div>

        <div v-if="nameError != ''" class="error">
          <p>{{ nameError }}</p>
        </div>
        <div v-if="nameSuccess" class="success">
          <p>Name Updated!</p>
        </div>
      </form>

      <form action="#" @submit.prevent="updateEmail">
        <h2>Change Email</h2>
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
              v-model="email"
            />
          </div>
        </div>

        <div>
          <button type="submit" class="submit">
            <p>Update</p>
          </button>
        </div>

        <div v-if="emailError != ''" class="error">
          <p>{{ emailError }}</p>
        </div>
        <div v-if="emailSuccess" class="success">
          <p>Email Updated!</p>
        </div>
      </form>

      <form action="#" @submit.prevent="updatePassword">
        <h2>Change Password</h2>

        <input
          type="email"
          name="email"
          autocomplete="email"
          :value="user.email"
          style="display:none"
        />

        <div class="group">
          <label for="password">
            Current Password
          </label>

          <div>
            <input
              type="password"
              class="form-control"
              name="password"
              autocomplete="current-password"
              placeholder="Current Password"
              required
              v-model="password.current"
            />
          </div>
        </div>

        <div class="group">
          <label for="password">
            New Password
          </label>

          <div>
            <input
              type="password"
              class="form-control"
              name="new-password"
              autocomplete="new-password"
              placeholder="New Password"
              required
              v-model="password.new"
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
              name="comfirm-password"
              autocomplete="new-password"
              placeholder="Comfirm Password"
              required
              v-model="password.comfirmNew"
            />
          </div>
        </div>

        <div>
          <button type="submit" class="submit">
            <p>Update</p>
          </button>
        </div>

        <div v-if="passwordError != ''" class="error">
          <p>{{ passwordError }}</p>
        </div>
        <div v-if="passwordSuccess" class="success">
          <p>Password Updated!</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import firebase from "firebase/app";
import { UserAttributes } from "@/models";

@Component
export default class Register extends Vue {
  get attributes(): UserAttributes {
    return this.$store.state.user.attributes;
  }

  get user(): firebase.User {
    return this.$store.state.user.user;
  }

  // form handling
  name = {
    first: "",
    last: ""
  };

  email = this.user.email || "";

  password = {
    current: "",
    new: "",
    comfirmNew: ""
  };

  created() {
    this.name.first = this.attributes.firstName;
    this.name.last = this.attributes.lastName;
  }

  nameError: string = "";
  emailError: string = "";
  passwordError: string = "";

  nameSuccess = false;
  emailSuccess = false;
  passwordSuccess = false;

  async updateName() {
    this.nameError = "";
    this.nameSuccess = false;

    if (
      this.name.first == this.attributes.firstName &&
      this.name.last == this.attributes.lastName
    ) {
      return;
    }

    this.$store
      .dispatch(
        "user/setAttributes",
        new UserAttributes(
          this.name.first,
          this.name.last,
          this.$store.state.user.attributes.admin
        )
      )
      .then(() => {
        this.nameSuccess = true;
      })
      .catch(err => {
        this.nameError = err.message;
      });
  }

  async updateEmail() {
    this.emailError = "";
    this.emailSuccess = false;

    if (this.email == this.user.email) {
      return;
    }

    try {
      await this.user.updateEmail(this.email);
    } catch (err) {
      this.emailError = err.message;
      return;
    }

    this.emailSuccess = true;
  }

  async updatePassword() {
    this.passwordError = "";
    this.passwordSuccess = false;

    // check comfirm password matches
    if (this.password.new != this.password.comfirmNew) {
      this.passwordError = "Passwords do not match";
      return;
    }

    // verify current password
    var user = firebase.auth().currentUser;
    if (user == null) {
      this.passwordError = "Could Not Access Current User";
      return;
    }
    var credential = firebase.auth.EmailAuthProvider.credential(
      user.email || "",
      this.password.current
    );

    try {
      await user.reauthenticateWithCredential(credential);
    } catch (err) {
      this.passwordError = "Current Password Incorrect";
      return;
    }

    // set password
    try {
      await user.updatePassword(this.password.new);
    } catch (err) {
      this.passwordError = err.message;
    }

    this.passwordSuccess = true;
  }

  // go back to home if not logged in
  get loggedIn(): boolean {
    return this.$store.getters["user/loggedIn"];
  }

  mounted() {
    if (!this.loggedIn) {
      this.$router.push("/");
    }
  }

  @Watch("this.loggedIn")
  test(loggedIn: boolean) {
    if (!loggedIn) {
      this.$router.push("/");
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

  h2 {
    color: $headingColor;
    font-size: 1.25em;
    margin-bottom: 0.25em;
  }

  form {
    margin-bottom: 3em;
  }

  .submit {
    width: 20%;
    padding: 0.2em;
    font-size: 0.75em;
  }

  .success {
    @include alert;
    background-color: green;
  }
}
</style>

<template>
  <div
    v-if="user"
    id="register"
  >
    <div class="inside">
      <h1>Manage Account Info</h1>
      <form
        action="#"
        @submit.prevent="updateName"
      >
        <h2>Edit Name</h2>
        <div class="group">
          <label for="firstName">
            First Name
          </label>

          <div>
            <input
              v-model="nameForm.first"
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
              v-model="nameForm.last"
              type="text"
              class="form-control"
              name="last-name"
              autocomplete="family-name"
              placeholder="Last Name"
              required
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="submit"
          >
            <p>Update</p>
          </button>
        </div>
      </form>

      <form
        action="#"
        @submit.prevent="updateEmail"
      >
        <h2>Change Email</h2>
        <div class="group">
          <label for="password">
            Current Password
          </label>
          <div>
            <input
              v-model="emailForm.password"
              type="password"
              class="form-control"
              name="password"
              autocomplete="current-password"
              placeholder="Current Password"
              required
            >
          </div>

          <label for="email">
            Email
          </label>
          <div>
            <input
              v-model="emailForm.email"
              type="email"
              class="form-control"
              name="email"
              autocomplete="email"
              placeholder="Email"
              required
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="submit"
          >
            <p>Update</p>
          </button>
        </div>
      </form>

      <form
        action="#"
        @submit.prevent="updatePassword"
      >
        <h2>Change Password</h2>

        <input
          type="email"
          name="email"
          autocomplete="email"
          :value="user.email"
          style="display:none"
        >

        <div class="group">
          <label for="password">
            Current Password
          </label>

          <div>
            <input
              v-model="passwordForm.current"
              type="password"
              class="form-control"
              name="password"
              autocomplete="current-password"
              placeholder="Current Password"
              required
            >
          </div>
        </div>

        <div class="group">
          <label for="password">
            New Password
          </label>

          <div>
            <input
              v-model="passwordForm.new"
              type="password"
              class="form-control"
              name="new-password"
              autocomplete="new-password"
              placeholder="New Password"
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
              v-model="passwordForm.comfirmNew"
              type="password"
              class="form-control"
              name="comfirm-password"
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
            <p>Update</p>
          </button>
        </div>
      </form>

      <form
        action="#"
        @submit.prevent="deleteUser"
      >
        <h2>Delete Account</h2>
        <div class="group">
          <label for="password">
            Current Password
          </label>

          <div>
            <input
              v-model="deleteForm.password"
              type="password"
              class="form-control"
              name="password"
              autocomplete="current-password"
              placeholder="Current Password"
              required
            >
          </div>
        </div>

        <button
          type="submit"
          class="submit danger"
        >
          <p>Delete</p>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase/app";
import { UserAttributes } from "@/models";
import { db } from "@/main";

@Component
export default class Register extends Vue {
  get attributes(): UserAttributes {
    return this.$store.state.user.attributes;
  }

  get user(): firebase.User {
    return this.$store.state.user.user;
  }

  // form handling
  nameForm = {
    first: "",
    last: "",
  };

  emailForm = {
    password: "",
    email: this.user.email || "",
  };

  passwordForm = {
    current: "",
    new: "",
    comfirmNew: "",
  };

  deleteForm = {
    password: "",
  };

  created() {
    this.nameForm.first = this.attributes.firstName;
    this.nameForm.last = this.attributes.lastName;
  }

  updateName() {
    if (
      this.nameForm.first == this.attributes.firstName &&
      this.nameForm.last == this.attributes.lastName
    ) {
      return;
    }

    this.$store
      .dispatch(
        "user/setAttributes",
        new UserAttributes(
          this.nameForm.first,
          this.nameForm.last,
          this.$store.state.user.attributes.admin
        )
      )
      .then(() => {
        this.$toaster.success("Name Updated!");
      })
      .catch((err) => {
        this.$toaster.error(err.message);
      });
  }

  async updateEmail() {
    if (this.emailForm.email == this.user.email) {
      return;
    }

    // reauthenticate
    let credential = firebase.auth.EmailAuthProvider.credential(
      this.user.email || "",
      this.emailForm.password
    );
    try {
      await this.user.reauthenticateWithCredential(credential);
    } catch (err) {
      this.$toaster.error("Current Password is Incorrect");
      return;
    }

    // update email
    try {
      await this.user.updateEmail(this.emailForm.email);
      await this.user.sendEmailVerification();
      this.$toaster.success(
        "Email Updated! Click on the link sent to your new email to verify it."
      );
    } catch (err) {
      this.$toaster.error(err.message);
      return;
    }
  }

  async updatePassword() {
    // check comfirm password matches
    if (this.passwordForm.new != this.passwordForm.comfirmNew) {
      this.$toaster.error("Passwords do not match");
      return;
    }

    // verify current password
    let user = firebase.auth().currentUser;
    if (user == null) {
      this.$toaster.error("Could Not Access Current User");
      return;
    }
    let credential = firebase.auth.EmailAuthProvider.credential(
      user.email || "",
      this.passwordForm.current
    );

    try {
      await user.reauthenticateWithCredential(credential);
    } catch (err) {
      this.$toaster.error("Current Password is Incorrect");
      return;
    }

    // set password
    try {
      await user.updatePassword(this.passwordForm.new);
    } catch (err) {
      this.$toaster.error(err.message);
    }

    this.$toaster.success("Password updated!");
    this.$store.dispatch("user/signOut").then(() => {
      this.$router.push("/login");
    });
  }

  async deleteUser() {
    // comfirm destructive action
    if (
      !confirm("Are you sure you want to delete permanently your account?")
    ) {
      return;
    }

    // verify current password
    let user = firebase.auth().currentUser;
    if (user == null) {
      this.$toaster.error("Could Not Access Current User");
      return;
    }
    let credential = firebase.auth.EmailAuthProvider.credential(
      user.email || "",
      this.deleteForm.password
    );
    try {
      await user.reauthenticateWithCredential(credential);
    } catch (err) {
      this.$toaster.error("Current Password is Incorrect");
      return;
    }

    // delete user from all shifts
    this.$store.dispatch("events/removeAllAttendanceForUser", {
      deleteId: this.user.uid,
      attributes: this.attributes
    })
    
    // delete user
    try {
      await db.collection("users").doc(this.user.uid).delete();
      await this.user.delete();
    } catch {
      this.$toaster.error("Delete failed")
      return;
    }
    
    // react to success
    this.$toaster.success("Account deleted")
    this.$router.push("/");
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

  form {
    margin-bottom: 2.75em;
  }

  .submit {
    width: 20%;
    padding: 0.2em;
    font-size: 0.75em;

    &.danger {
      @include scary-button-color;
    }
  }
}
</style>

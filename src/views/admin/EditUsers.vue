<template>
  <div id="edit-users">
    <div class="inside">
      <h1>Manage Users</h1>
      <div
        v-for="user in users"
        id="user-section"
        :key="user.id"
      >
        <p>{{ user.user.firstName }} {{ user.user.lastName }}</p>
        <p v-if="user.id == currentUid">
          Cannot Edit Curent User
        </p>
        <button
          v-else-if="user.user.admin"
          @click="setAdmin(false, user.id)"
        >
          Revoke Admin
        </button>
        <button
          v-else
          @click="setAdmin(true, user.id)"
        >
          Make admin
        </button>
        <hr>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { db } from "@/main";
import { UserAttributes } from "@/models";

interface UserAttrWithId {
  id: string
  user: UserAttributes
}

@Component
export default class NewEvent extends Vue {
  private users: UserAttrWithId[] = [];
  private currentUid: string = this.$store.state.user.user.uid;

  async setAdmin(to: boolean, uid: string) {
    // get user by id
    const index = this.users.findIndex(user => user.id == uid);
    let user = this.users[index].user;

    // confirm
    const text = to ? `Make ${user.firstName} ${user.lastName} an admin?`
                    : `Revoke ${user.firstName} ${user.lastName}'s admin privilages?`;
    if (!confirm(text)) {
      return;
    }

    // update server
    const userRef = db.collection("users").doc(uid);
    try {
      await userRef.update({
        admin: to,
      });
    } catch (err) {
      this.$toaster.error(err);
      return;
    }
    
    // update local
    user.admin = to;
    Vue.set(this.users, index, { id: uid, user });

    // Display success
    const success = to ? `Made ${user.firstName} ${user.lastName} an admin`
                       : `Revoked ${user.firstName} ${user.lastName}'s admin privilages`;
    this.$toaster.success(success);
  }

  mounted() {
    // get the name from firestore
    db.collection("users").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let user = doc.data() as UserAttributes;
        this.users.push({ id: doc.id, user });
      })
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#edit-users {
  @include shadow-box;
  @include std-size;
  @include std-position;

  #user-section {
    margin: 1.4em;

    p {
      font-size: 1.2em;
      margin-bottom: 0.3em;
    }

    button {
      padding: 0.2em 0.1em;
      @include button;
    }
  }

  hr {
    margin-top: 0.75em;
    margin-bottom: 0.75em;
    border-top: 1px solid darkgrey;
  }
}
</style>

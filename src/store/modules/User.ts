import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import firebase from "firebase/app";

type OptUser = firebase.User | null;

@Module
export default class User extends VuexModule {
  user: OptUser = null;

  get loggedIn() {
    return this.user !== null;
  }

  @Mutation
  setUser(user: OptUser) {
    this.user = user;
    if (user !== null) {
      // TODO: Set display name from server
    }
  }
}

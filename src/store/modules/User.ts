import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import firebase from "firebase/app";
import { UserAttributes } from "@/models";
import { db } from "@/main";

type OptUser = firebase.User | null;
type OptAttributes = UserAttributes | null;

@Module
export default class User extends VuexModule {
  user: OptUser = null;
  attributes: OptAttributes = null;

  get loggedIn() {
    return this.user !== null;
  }

  @Mutation
  private _setUser(user: OptUser) {
    this.user = user;
  }

  @Mutation
  setAttributes(attributes: OptAttributes) {
    this.attributes = attributes;
  }

  @Action
  setUser(user: OptUser) {
    this.context.commit("_setUser", user);
    if (user) {
      this.context.dispatch("pullAttributes", user);
    }
  }

  @Action({ commit: "setAttributes" })
  async pullAttributes() {
    if (this.user == null) {
      return;
    }

    const id = this.user.uid;
    const usersRef = db.collection("users");

    try {
      const doc = await usersRef.doc(id).get();

      if (!doc.exists) {
        console.log("No such document for " + id);
        return null;
      }

      const newAttributes = <UserAttributes>doc.data();
      return new UserAttributes(
        newAttributes.firstName,
        newAttributes.lastName,
        newAttributes.admin
      );
    } catch (err) {
      console.log("Error getting document", err);
    }
  }

  @Action({ rawError: true, commit: "setAttributes" })
  async registerUser(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const auth = firebase.auth();
    try {
      // calls setUser automatically on success
      const userCred = await auth.createUserWithEmailAndPassword(
        payload.email,
        payload.password
      );

      // set user
      if (userCred.user == null) {
        throw new Error("Account Registration Failed. Please Contact Support.");
      }

      // set attributes
      let attributes = new UserAttributes(
        payload.firstName,
        payload.lastName,
        false
      );

      // save attributes to database
      const usersRef = db.collection("users");
      usersRef.doc(userCred.user.uid).set(Object.assign({}, attributes));

      return attributes;
    } catch (err) {
      throw err;
    }
  }

  @Action({ rawError: true })
  async signIn(payload: { email: string; password: string }) {
    // calls setUser automatically on success
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password);
  }

  @Action
  async signOut() {
    firebase
      .auth()
      .signOut() // calls setUser automatically
      .then(() => {
        this.context.commit("setAttributes", null);
      });
  }
}

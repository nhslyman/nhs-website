import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import firebase from "firebase/app";
import { plainToClass, classToPlain } from "class-transformer";
import { UserAttributes, RSVP } from "@/models";
import { db } from "@/main";
import { Optional, VoidAction } from '@/util';

@Module({ namespaced: true })
export default class User extends VuexModule {
  // properties
  user: Optional<firebase.User> = null;
  attributes: Optional<UserAttributes> = null;

  get loggedIn() {
    return this.user != null;
  }

  // basic setters
  @Mutation
  private _getUser() {
    this.user = firebase.auth().currentUser;
  }

  @Mutation
  private _setAttributes(attributes: Optional<UserAttributes>) {
    this.attributes = attributes;
  }

  @Action
  async userChanged() {
    this.context.commit("_getUser");
    await this.context.dispatch("getAttributes");
  }

  @Action
  async setAttributes(attributes: UserAttributes) {
    if (this.user == null) {
      return;
    }

    try {
      const usersRef = db.collection("users");
      await usersRef.doc(this.user.uid).set(classToPlain(attributes));
      this.context.commit("_setAttributes", attributes);
    } catch (err) {
      throw new Error("Server Error Setting Name");
    }
  }

  // login flow
  @Action({ rawError: true, commit: "_setAttributes" })
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
      } else {
        userCred.user.sendEmailVerification();
      }

      // set attributes
      let attributes = new UserAttributes(payload.firstName, payload.lastName);

      // save attributes to database
      const usersRef = db.collection("users");
      usersRef.doc(userCred.user.uid).set(classToPlain(attributes));

      return attributes;
    } catch (err) {
      throw err;
    }
  }

  @Action({ rawError: true })
  async signIn(payload: { email: string; password: string }) {
    // calls setUser automatically on success
    await firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password);
  }

  @Action
  async signOut() {
    await firebase
      .auth()
      .signOut() // calls setUser automatically
      .then(() => {
        this.context.commit("_setAttributes", null);
      });
  }

  // Events
  @Mutation
  addEvent(payload: RSVP) {
    if (this.attributes == null) {
      return;
    }
    this.attributes.events.push(payload);
  }

  @Mutation
  removeEvent(eventID: string) {
    if (this.attributes == null) {
      return;
    }
    this.attributes.events = this.attributes.events.filter(
      event => event.eventID != eventID
    );
  }

  @Action
  async signUpForEvent(payload: RSVP) {
    if (this.attributes == null || this.user == null) {
      return;
    }
    this.context.commit("addEvent", payload);
    this.context.dispatch("pushEvents");
  }

  @Action
  async unregisterForEvent(payload: RSVP) {
    if (this.attributes == null || this.user == null) {
      return;
    }
    this.context.commit("removeEvent", payload.eventID);
    this.context.dispatch("pushEvents");
  }

  // firestore coordination
  @Action
  async getAttributes() {
    if (!this.user) {
      this.context.commit("_setAttributes", null);
      return;
    }
    const document = db.collection("users").doc(this.user.uid);
    const snap = await document.get()
    const data = snap.data()
    if (data) {
      this.context.commit("_setAttributes", plainToClass(UserAttributes, data));
    } else {
      this.context.commit("_setAttributes", null);
    }
  }

  @Action
  async pushEvents() {
    if (this.attributes == null || this.user == null) {
      return;
    }
    const doc = db.collection("users").doc(this.user.uid);
    const events = classToPlain(this.attributes.events);
    await doc.update({ events: events });
  }
}

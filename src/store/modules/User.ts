import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import firebase from "firebase/app";
import { plainToClass, classToPlain } from "class-transformer";
import { UserAttributes, RSVP } from "@/models";
import { db } from "@/main";

type OptUser = firebase.User | null;
type OptAttributes = UserAttributes | null;

@Module({ namespaced: true })
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
  _setAttributes(attributes: OptAttributes) {
    this.attributes = attributes;
  }

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
  async setUser(user: OptUser) {
    this.context.commit("_setUser", user);
    if (user) {
      try {
        await this.context.dispatch("pullAttributes", user);
      } catch (err) {
        // TODO: server log
      }
    }
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

  @Action
  async pushEvents() {
    if (this.attributes == null || this.user == null) {
      return;
    }
    const doc = db.collection("users").doc(this.user.uid);
    const events = classToPlain(this.attributes.events);
    await doc.update({ events: events });
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

  @Action({ commit: "_setAttributes" })
  async pullAttributes() {
    if (this.user == null) {
      return;
    }

    const id = this.user.uid;
    const usersRef = db.collection("users");

    try {
      const doc = await usersRef.doc(id).get();

      if (!doc.exists) {
        throw new Error("No such document for " + id);
      }

      return plainToClass(UserAttributes, doc.data());
    } catch (err) {
      throw new Error("Error getting document: " + err.message);
    }
  }

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
}

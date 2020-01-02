import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import firebase from "firebase/app";
import { plainToClass, classToPlain } from "class-transformer";
import { UserAttributes, RSVP } from "@/models";
import { db } from "@/main";

type OptUser = firebase.User | null;
type OptAttributes = UserAttributes | null;
type OptAction = (() => void) | null;

@Module({ namespaced: true })
export default class User extends VuexModule {
  // properties
  user: OptUser = null;
  attributes: OptAttributes = null;
  private unsubscribe: OptAction = null;

  get loggedIn() {
    return this.user !== null;
  }

  // basic setters
  @Mutation
  private _setUser(user: OptUser) {
    this.user = user;
  }

  @Mutation
  private _setAttributes(attributes: OptAttributes) {
    this.attributes = attributes;
  }

  // setters with side effects
  @Action
  async setUser(user: OptUser) {
    this.context.commit("_setUser", user);
    if (this.unsubscribe != null) {
      this.unsubscribe();
      this.context.commit("setUnsubscribe", null);
    }
    if (user) {
      this.context.dispatch("setListener", user);
    }
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
  @Mutation
  setUnsubscribe(action: OptAction) {
    this.unsubscribe = action;
  }

  @Action
  setListener() {
    if (this.user == null) {
      this.context.commit("setUnsubscribe", null);
      return;
    }
    const document = db.collection("users").doc(this.user.uid);
    const unsubscribe = document.onSnapshot(
      snap => {
        let attributes = plainToClass(UserAttributes, snap.data());
        this.context.commit("_setAttributes", attributes);
      },
      err => {
        // TODO: server log
      }
    );
    this.context.commit("setUnsubscribe", unsubscribe);
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

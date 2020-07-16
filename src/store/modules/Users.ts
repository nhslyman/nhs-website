import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { plainToClass, classToPlain } from "class-transformer";
import { UserAttributes } from "@/models";
import { db } from "@/main";

interface UserDict {
  [key: string]: UserAttributes;
}

interface ActionDict {
  [key: string]: () => void;
}

@Module({ namespaced: true })
export default class Events extends VuexModule {
  // properties
  private users: UserDict = {};
  private unsubscribes: ActionDict = {};

  get usersDict() {
    return this.users;
  }

  // firestore
  @Mutation
  private _setUser(payload: { userID: string; user: UserAttributes }) {
    this.users[payload.userID] = payload.user;
  }

  @Mutation
  private setUnsubscribes(actions: ActionDict) {
    this.unsubscribes = actions;
  }

  @Action
  async setListeners() {
    const collection = await db.collection("users").get();
    let unsubs: ActionDict = {};
    collection.docs.forEach((doc) => {
      const id = doc.id;
      unsubs[id] = doc.ref.onSnapshot(
        (snap) => {
          const event = snap.data() || {};
          const obj = plainToClass(UserAttributes, event);
          this.context.commit("_setUser", {
            userID: id,
            user: obj,
          });
        },
        (err) => {
          // TODO: server log
        }
      );
    });
    this.context.commit("setUnsubscribes", unsubs);
  }
}

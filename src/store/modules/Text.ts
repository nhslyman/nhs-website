import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { db } from "@/main";

interface ActionDict {
  [key: string]: () => void;
}

@Module({ namespaced: true })
export default class Text extends VuexModule {
  // properties
  private home: String = "";
  private unsubscribes: ActionDict = {};

  get homeText(): String {
    return this.home;
  }

  // basic setters
  @Mutation
  private _setHome(text: String) {
    this.home = text;
  }

  // events
  @Action
  async setHome(text: String) {
    this.context.commit("_setHome", text);
    await this.context.dispatch("pushHome", text);
  }

  // firestore coordination
  @Mutation
  setUnsubscribes(actions: ActionDict) {
    this.unsubscribes = actions;
  }

  @Action
  async pushHome(text: string) {
    const newText: any = { value: text };
    const homeRef = db.collection("text").doc("home");
    try {
      await homeRef.set(newText);
    } catch (err) {
      // TODO: server log
    }
  }

  @Action
  async setListeners() {
    const document = await db.collection("text").doc("home");
    let unsubs: ActionDict = {};
    unsubs["home"] = document.onSnapshot(
      (snap) => {
        const homeText = snap.data() || {};
        this.context.commit("_setHome", homeText.value);
      },
      (err) => {
        // TODO: server log
      }
    );
    this.context.commit("setUnsubscribes", unsubs);
  }
}

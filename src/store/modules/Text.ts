import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { db } from "@/main";
import { Dict, VoidAction } from '@/util';

@Module({ namespaced: true })
export default class Text extends VuexModule {
  // properties
  private home: String = "";
  private unsubscribes: Dict<VoidAction> = {};
  private initialSetUpOccurred = false;

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
  setUnsubscribes(actions: Dict<VoidAction>) {
    this.unsubscribes = actions;
  }

  @Mutation
  didSetUp() {
    this.initialSetUpOccurred = true;
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
    if (this.initialSetUpOccurred) {
      return;
    }

    const document = await db.collection("text").doc("home");
    let unsubs: Dict<VoidAction> = {};
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
    this.context.commit("didSetUp");
  }
}

import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

import User from "@/store/modules/User";
import Events from "@/store/modules/Events";

import { RSVP } from "@/models";

Vue.use(Vuex);

interface State {
  user: User;
  events: Events;
}

const vuexPersist = new VuexPersist<State>({
  key: "lymannhs",
  storage: window.localStorage
});

const store = new Vuex.Store<State>({
  plugins: [vuexPersist.plugin],
  modules: {
    user: User,
    events: Events
  },
  actions: {
    setListeners(context: any) {
      context.dispatch("user/setListener");
      context.dispatch("events/setListener");
    },
    async signUpForEvent(context: any, payload: RSVP) {
      await context.dispatch("user/signUpForEvent", payload);
      await context.dispatch("events/signUpForEvent", payload);
    },
    async unregisterForEvent(context: any, payload: RSVP) {
      await context.dispatch("user/unregisterForEvent", payload);
      await context.dispatch("events/unregisterForEvent", payload);
    }
  }
});

export default store;

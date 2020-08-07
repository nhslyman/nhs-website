import Vue from "vue";
import Vuex from "vuex";

import User from "@/store/modules/User";
import Events from "@/store/modules/Events";
import Text from "@/store/modules/Text";

import { RSVP } from "@/models";

Vue.use(Vuex);

interface State {
  user: User;
  events: Events;
  text: Text;
}

const store = new Vuex.Store<State>({
  modules: {
    user: User,
    events: Events,
    text: Text,
  },
  actions: {
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

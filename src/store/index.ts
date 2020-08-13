import Vue from "vue";
import Vuex from "vuex";

import User from "@/store/modules/User";
import Events from "@/store/modules/Events";
import Text from "@/store/modules/Text";

import { RSVP, ShiftSignUp } from "@/models";

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
    async signUpForShift(context: any, payload: ShiftSignUp) {
      await context.dispatch("user/signUpForShift", payload);
      await context.dispatch("events/signUpForShift", payload);
    },
    async unregisterForShift(context: any, payload: ShiftSignUp) {
      await context.dispatch("user/unregisterForShift", payload);
      await context.dispatch("events/unregisterForShift", payload);
    }
  }
});

export default store;

import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

import User from "@/store/modules/User";
import Events from "@/store/modules/Events";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "lymannhs",
  storage: window.localStorage
});

const store = new Vuex.Store({
  plugins: [vuexPersist.plugin],
  modules: {
    user: User,
    events: Events
  }
});

export default store;

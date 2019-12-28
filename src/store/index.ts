import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

import User from "@/store/modules/User.ts";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "lymannhs",
  storage: window.localStorage
});

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  modules: {
    user: User
  }
});

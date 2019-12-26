import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import * as firebase from "firebase";

Vue.config.productionTip = false;

// all set in .env file
const configOptions = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
};

firebase.initializeApp(configOptions);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

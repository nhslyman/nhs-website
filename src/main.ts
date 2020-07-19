// Firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const configOptions = {
  apiKey: "AIzaSyA1_OmaD0wAVGub9IsNEk1o7KXwEpjc-TQ",
  authDomain: "lyman-nhs.firebaseapp.com",
  databaseURL: "https://lyman-nhs.firebaseio.com",
  projectId: "lyman-nhs",
  storageBucket: "lyman-nhs.appspot.com",
  messagingSenderId: "331035825804",
  appId: "1:331035825804:web:ecf34835b51dae4a464da9"
};

firebase.initializeApp(configOptions);

export const db = firebase.firestore();

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("user/setUser", user);
});

// Add toast
import { ToasterPlugin } from "@/toast";
Vue.use(ToasterPlugin);

// Create Vue Instance
import "reflect-metadata"; // for class-transformer
import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

Vue.config.productionTip = false;
store.dispatch("setListeners");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

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
  store.dispatch("setUser", user);
});

// Create Vue Instance
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
store.dispatch("setEventListener");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

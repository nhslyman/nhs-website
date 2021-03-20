// Customizable

const configOptions = {
  apiKey: "AIzaSyC6Hd4EZR-XQ_afNY0KHN3bR7xFKdYPZJ4",
  authDomain: "nhs-lyman.firebaseapp.com",
  databaseURL: "https://nhs-lyman.firebaseio.com",
  projectId: "nhs-lyman",
  storageBucket: "nhs-lyman.appspot.com",
  messagingSenderId: "496342887911",
  appId: "1:496342887911:web:39a07b6395e99a7c91a142"
};

export const orgName = "Lyman NHS"

// Firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

firebase.initializeApp(configOptions);

export const db = firebase.firestore();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Add toast
import { ToasterPlugin } from "@/toast";
Vue.use(ToasterPlugin);

// Create Vue Instance
import "reflect-metadata"; // for class-transformer
import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import { Optional } from './util';

Vue.config.productionTip = false;

// Start after firebase auth has loaded the user
let app: Optional<Vue> = null;
firebase.auth().onAuthStateChanged(user => {
  store.dispatch("user/userChanged").then(() => {
    if (!app) {
      app = new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount("#app");
    }
  })
});

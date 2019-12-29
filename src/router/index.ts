import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  // home
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue")
  },
  // account
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register.vue")
  },
  {
    path: "/user",
    name: "user",
    component: () => import("@/views/User.vue")
  },
  // volunteer
  {
    path: "/volunteer",
    name: "volunteer",
    component: () => import("@/views/Volunteer.vue")
  },
  {
    path: "/volunteer/event/:id",
    name: "event",
    component: () => import("@/views/Event.vue")
  },
  // errors
  {
    path: "*",
    name: "404",
    component: () => import("@/views/NotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

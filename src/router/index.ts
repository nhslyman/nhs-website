import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

async function checkAdmin(to: Route, from: Route, next: Function) {
  const loggedIn: boolean = store.getters["user/loggedIn"];
  const admin: boolean | undefined = store.state.user.attributes?.admin;
  if (!loggedIn) {
    next("/login");
  } else if (admin == undefined) {
    next(false);
  } else if (admin) {
    next();
  } else {
    next("unauthorized");
  }
}

async function checkLoggedIn(to: Route, from: Route, next: Function) {
  const loggedIn: boolean = store.getters["user/loggedIn"];
  if (loggedIn) {
    next();
  } else {
    next("/login");
  }
}

async function checkLoggedOut(to: Route, from: Route, next: Function) {
  const loggedIn: boolean = store.getters["user/loggedIn"];
  if (loggedIn) {
    next("/");
  } else {
    next();
  }
}

const routes = [
  // home
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  // account
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/user/Login.vue"),
    beforeEnter: checkLoggedOut,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/user/Register.vue"),
    beforeEnter: checkLoggedOut,
  },
  {
    path: "/user",
    name: "user",
    component: () => import("@/views/user/User.vue"),
    beforeEnter: checkLoggedIn,
  },
  // volunteer
  {
    path: "/events",
    name: "volunteer events",
    component: () => import("@/views/volunteer/Events.vue"),
  },
  {
    path: "/events/past",
    name: "past events",
    component: () => import("@/views/volunteer/PastEvents.vue"),
    beforeEnter: checkLoggedIn,
  },
  {
    path: "/events/view/:id",
    name: "view event",
    component: () => import("@/views/volunteer/ViewEvent.vue"),
    beforeEnter: checkLoggedIn,
  },
  // admin
  {
    path: "/admin",
    name: "admin console",
    component: () => import("@/views/admin/Console.vue"),
    beforeEnter: checkAdmin,
  },
  {
    path: "/admin/home",
    name: "edit home text",
    component: () => import("@/views/admin/EditHome.vue"),
    beforeEnter: checkAdmin,
  },
  {
    path: "/admin/events",
    name: "manage events",
    component: () => import("@/views/admin/EventsList.vue"),
    beforeEnter: checkAdmin,
  },
  {
    path: "/admin/events/edit/:id",
    name: "edit event",
    component: () => import("@/views/admin/EditEvent.vue"),
    beforeEnter: checkAdmin,
  },
  // errors
  {
    path: "/unauthorized",
    name: "403",
    component: () => import("@/views/error/Unauthorized.vue"),
  },
  {
    path: "*",
    name: "404",
    component: () => import("@/views/error/NotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

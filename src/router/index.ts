import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

async function checkAdmin(to: Route, from: Route, next: Function) {
  const loggedIn: boolean = store.getters["user/loggedIn"];
  const admin: boolean = store.state.user.attributes?.admin ?? false;
  if (!loggedIn) {
    next("/login");
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

async function normalEventPage(to: Route, from: Route, next: Function) {
  const loggedIn: boolean = store.getters["user/loggedIn"];
  if (loggedIn) {
    store.dispatch("events/setListeners");
    next();
  } else {
    next("/login");
  }
}

async function adminEventPage(to: Route, from: Route, next: Function) {
  const loggedIn: boolean = store.getters["user/loggedIn"];
  const admin: boolean = store.state.user.attributes?.admin ?? false;
  if (!loggedIn) {
    next("/login");
  } else if (admin) {
    store.dispatch("events/setListeners");
    next();
  } else {
    next("unauthorized");
  }
}

async function normalHomePage(to: Route, from: Route, next: Function) {
  store.dispatch("text/setListeners");
  next();
}

async function adminHomePage(to: Route, from: Route, next: Function) {
  const loggedIn: boolean = store.getters["user/loggedIn"];
  const admin: boolean = store.state.user.attributes?.admin ?? false;
  if (!loggedIn) {
    next("/login");
  } else if (admin) {
    store.dispatch("text/setListeners");
    next();
  } else {
    next("unauthorized");
  }
}

const routes = [
  // home
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
    beforeEnter: normalHomePage,
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
    path: "/forgot",
    name: "forgot password",
    component: () => import("@/views/user/Forgot.vue"),
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
    beforeEnter: normalEventPage,
  },
  {
    path: "/events/past",
    name: "past events",
    component: () => import("@/views/volunteer/PastEvents.vue"),
    beforeEnter: normalEventPage,
  },
  {
    path: "/events/view/:id",
    name: "view event",
    component: () => import("@/views/volunteer/ViewEvent.vue"),
    beforeEnter: normalEventPage,
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
    beforeEnter: adminHomePage,
  },
  {
    path: "/admin/users",
    name: "manage users",
    component: () => import("@/views/admin/EditUsers.vue"),
    beforeEnter: checkAdmin,
  },
  {
    path: "/admin/events",
    name: "manage events",
    component: () => import("@/views/admin/EventsList.vue"),
    beforeEnter: adminEventPage,
  },
  {
    path: "/admin/events/new",
    name: "new event",
    component: () => import("@/views/admin/NewEvent.vue"),
    beforeEnter: adminEventPage,
  },
  {
    path: "/admin/events/users/:id",
    name: "users for event",
    component: () => import("@/views/admin/EventUsers.vue"),
    beforeEnter: adminEventPage,
  },
  {
    path: "/admin/events/edit/:id",
    name: "edit event",
    component: () => import("@/views/admin/EditEvent.vue"),
    beforeEnter: adminEventPage,
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

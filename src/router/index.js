import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/tabs-demo",
    name: "tabs-demo",
    component: () => import("../views/tabs-demo.vue"),
  },
  {
    path: "/sticky-demo",
    name: "sticky-demo",
    component: () => import("../views/sticky-demo.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

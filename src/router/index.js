import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: 'auth',
    component: () => import("@/pages/Auth.vue"),

    // children: [
    //   {
    //     path: "",
    //     name: "home",
    //     component: () => import("@/pages/Home.vue"),
    //   },
    //   {
    //     path: "/todos",
    //     name: "todos",
    //     component: () => import("@/pages/Todos.vue"),
    //   },
    // ],
  },
  {
    path: "/main",
    name: "main",
    component: () => import("@/layouts/AppLayout.vue"),
  }

];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
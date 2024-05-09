import { createRouter, createWebHistory } from "vue-router";
import api from "@/api";
const routes = [
  {
    path: "/",
    name: "auth",
    component: () => import("@/pages/Auth.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/main",
    name: "main",
    component: () => import("@/layouts/AppLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "feed",
        component: () => import("@/pages/NewsFeed.vue"),
      },
      {
        path: "/article/:id?",
        name: "create",
        component: () => import("@/pages/NewArticle.vue"),
      },
      {
        path: "/details/:id",
        name: "details",
        component: () => import("@/pages/ViewDetails.vue"),
      },
    ],
  },
  {
    path: "/:pregMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/NotFound.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

//guard
router.beforeEach((to, from) => {
  const authenticated = localStorage.getItem("ajioasdmianc8a79sdy0fffaq");
  api.defaults.headers.common["Authorization"] = `Bearer ${authenticated}`;

  if (to.meta.requiresGuest && authenticated) {
    return { name: "main" };
  } else if (to.meta.requiresAuth && !authenticated) {
    localStorage.removeItem("ajioasdmianc8a79sdy0fffaq");
    return { name: "auth" };
  }
});

export default router;

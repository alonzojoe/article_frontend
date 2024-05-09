<template>
  <nav class="navbar fixed-top navbar-expand-lg bg-body-tertiary">
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <div>
        <a class="navbar-brand" href="">Bulletin Board Articles</a>
        <small class="d-block">Created By: Joenell Alonzo</small>
      </div>

      <button
        class="btn btn-primary btn-sm"
        @click="changeTab('create')"
        v-if="route.name === 'feed'"
      >
        Create New Article <i class="bx bx-plus-medical"></i>
      </button>
      <button
        class="btn btn-secondary btn-sm"
        @click="changeTab('feed')"
        v-else
      >
        Back to List of Articles <i class="bx bxs-left-arrow-alt"></i>
      </button>
      <div class="d-flex align-items-center gap-1" v-if="user">
        <a href="#" class="navbar-brand">Welcome: {{ user?.name }} </a>
        <button class="btn btn-danger btn-sm" @click="logout">
          Logout <i class="bx bxs-log-out"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/api";
export default {
  name: "Navbar",
  setup() {
    const router = useRouter();
    const user = ref({ name: "" });
    const route = useRoute();

    const logout = async () => {
      try {
        api.post("/auth/logout");
        api.defaults.headers.common["Authorization"] = "";
      } catch (error) {
        router.push({ name: "auth" });
      } finally {
        localStorage.removeItem("ajioasdmianc8a79sdy0fffaq");
        localStorage.removeItem("userData");
        router.push({ name: "auth" });
      }
    };

    const changeTab = (route) => {
      if (route == "create") {
        router.push({ name: "create" });
      } else {
        router.push({ name: "feed" });
      }
    };

    onMounted(() => {
      user.value = JSON.parse(localStorage.getItem("userData"));
    });

    return {
      user,
      logout,
      changeTab,
      route,
    };
  },
};
</script>

<style scoped></style>

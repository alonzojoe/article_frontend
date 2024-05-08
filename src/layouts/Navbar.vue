<template>
    <nav class="navbar fixed-top navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid d-flex justify-content-between">
            <a class="navbar-brand" href="">Bulletin Board</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <!-- <ul class="navbar-nav">
                    <li v-for="(m, index) in menus" class="nav-item" :index="index">
                        <router-link :to="{ name: m.name }" class="nav-link" :class="{ active: route.name === m.name }"
                            aria-current="page">{{ m.title }}</router-link>
                    </li>
                </ul> -->
            </div>
        </div>
    </nav>
</template>

<script>
import { useRoute } from "vue-router";
export default {
    name: "Navbar",
    setup() {
        const route = useRoute();
    },
};
</script>

<style scoped></style>
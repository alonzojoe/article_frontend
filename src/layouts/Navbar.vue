<template>
    <nav class="navbar fixed-top navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid d-flex justify-content-between align-items-center">
            <a class="navbar-brand" href="">Bulletin Board Articles </a>
            <button class="btn btn-primary btn-sm">Create New Article <i class='bx bx-plus-medical'></i></button>
            <div class="d-flex align-items-center gap-1" v-if="user">
                <a href="#" class="navbar-brand">Welcome: {{ user?.name }} </a>
                <button class="btn btn-danger btn-sm">Logout <i class='bx bxs-log-out'></i></button>
            </div>
        </div>
    </nav>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute } from "vue-router";
export default {
    name: "Navbar",
    setup() {
        const route = useRoute();
        const user = ref({ name: '' })
        onMounted(() => {
            user.value = JSON.parse(localStorage.getItem('userData'))
        })

        return {
            user
        }
    }
};
</script>

<style scoped></style>
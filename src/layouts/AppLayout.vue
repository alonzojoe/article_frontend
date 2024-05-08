<template>
    <Navbar />

    <div class="container" style="padding-top: 56px">
        <router-view />
    </div>
</template>

<script>
import Navbar from "./Navbar.vue";
export default {
    components: {
        Navbar,
    },
    setup() {
        return {};
    },
};
</script>

<style lang="scss" scoped></style>
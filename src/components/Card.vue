<template>
    <div class="card">

        <div class="card-body">
            <slot />

        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.card {
    width: 70vh;
}

@media screen and (max-width: 768px) {
    .card {
        width: 90vh;
    }
}
</style>
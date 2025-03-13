<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const route = useRoute();
</script>

<template>
    <Header v-if="route.path !== '/login'" />

    <RouterView />

    <Footer v-if="route.path !== '/login'" />
</template>

<style lang="scss" scoped>

</style>

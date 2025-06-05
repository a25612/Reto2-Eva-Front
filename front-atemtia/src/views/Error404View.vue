<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToHome() {
  router.push('/');
}
</script>

<template>
    <v-empty-state
        headline="Whoops, 404"
        title="Page not found"
        text="The page you were looking for does not exist"
        image="https://vuetifyjs.b-cdn.net/docs/images/logos/v.png"
    >
        <template #actions>
            <v-btn color="primary" @click="goToHome">Go to Home</v-btn>
        </template>
    </v-empty-state>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';
</style>
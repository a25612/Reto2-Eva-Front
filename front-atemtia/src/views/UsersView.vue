<script setup lang="ts">
import { useUsersStore } from '@/stores/user';
import { onMounted } from 'vue';

const store = useUsersStore()

store.findAll()

store.createUser({
    id: null,
    name: 'sample',
    surname: 'sample'
})
</script>

<template>
    Listado de usuarios
    <div v-for="user in store.users">
        {{ user.name }} {{ user.surname }}
    </div>
    <v-btn>Insertar usuario</v-btn>
</template>
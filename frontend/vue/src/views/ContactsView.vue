<script setup>
import { useAuthStore } from "../stores/auth.js";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import Header from "../components/Header.vue";
import AddContact from "../components/AddContact.vue";

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
    if (!authStore.isAuthenticated) {
        router.push("/connexion");
    }
});
</script>

<template>
    <div>
        <Header />
        <AddContact v-if="authStore.isAuthenticated" />
    </div>
</template>

<style scoped>
</style>
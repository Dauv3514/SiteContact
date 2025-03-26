<script setup>
  import { onMounted } from 'vue'
  import { useAuthStore } from '../src/stores/auth.js'
  import { RouterView } from 'vue-router'

  const authStore = useAuthStore()

  onMounted(() => {
    authStore.fetchUser()
  })
</script>

<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped>
  .container {
    max-width: 1000px;
    margin: 0 auto;
  }
</style>
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isMenuOpen = ref(false);

const links = ref([
  { name: "Accueil", path: "/" },
  { name: "Créer un contact", path: "/contacts" }
]);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <nav class="navbar">
    <div class="logo">Contact App</div>
    <button class="burger-menu" @click="toggleMenu">
      ☰
    </button>
    <ul :class="['nav-links', { 'open': isMenuOpen }]">
      <li v-for="link in links" :key="link.path">
        <router-link 
          :to="link.path"
          :class="{ active: route.path === link.path }"
          @click="isMenuOpen = false"
        >
          {{ link.name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>

.navbar {
  width: 100%;
  background-color: #000;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: start;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.nav-links {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: 20px;
  margin-left: 40px;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  text-decoration: none;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-links a:hover {
  background-color: #333;
}

.nav-links .active {
  background-color: #444;
}

.burger-menu {
  display: none;
  font-size: 24px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: auto;
}

@media screen and (max-width: 768px) {
  .burger-menu {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    background-color: #000;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    padding: 10px 0;
    text-align: center;
    margin-left: 0;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links li {
    padding: 10px 0;
  }
}
</style>

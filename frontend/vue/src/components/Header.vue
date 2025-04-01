<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useAuthStore } from "../stores/auth";
  import axios from "axios";

  const route = useRoute();
  const router = useRouter();
  const isMenuOpen = ref(false);
  const authStore = useAuthStore();
  const userData = ref(null);

  const links = ref([
    { name: "Accueil", path: "/" },
    { name: "Créer un contact", path: "/contacts" },
    { name: "Mes contacts favoris", path: "/favoris" }
  ]);

  // On effectue la requête API une fois que le composant est monté
  onMounted(async () => {
    if (authStore.isAuthenticated) {
      try {
        const apiUrl = "http://localhost:3000/api/users";
        const response = await axios.get(apiUrl);

        if (response.data.success) {
          userData.value = response.data.user; // On stocke les données de l'utilisateur
        }
      } catch (error) {
        console.error("Erreur de récupération de l'image de profil:", error);
      }
    }
  });

  // Calculer l'URL de l'image de profil en fonction des données utilisateur
  const profileImage = computed(() => {
    return userData.value ? `http://localhost:3000/api/uploads/${userData.value.profile_image}` : null;
  });

  // const profileImage = computed(() => {
  //   return response.value && response.value.user 
  //   ? `/api/uploads/${response.value.user.profile_image}` 
  //   : null;
  // });

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const logout = async () => {
    await authStore.logout();
    router.push("/connexion");
    isMenuOpen.value = false;
  };

  const login = async () => {
    router.push("/connexion");
  };

  const register = async () => {
    router.push("/inscription");
  };
</script>

<template>
  <nav class="navbar">
    <div class="logo">Contact App</div>

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

    <div class="nav-right">
      <img 
        v-if="profileImage" 
        :src="profileImage" 
        alt="Photo de profil"
        class="profilImage"
      />
      <button v-if="authStore.isAuthenticated" class="logout-button" @click="logout">Déconnexion</button>
      <div v-else>
        <button class="login-button" @click="login">Connexion</button>
        <button class="logout-button" @click="register">Inscription</button>
      </div>
      <button class="burger-menu" @click="toggleMenu">☰</button>
    </div>

    <ul v-if="isMenuOpen" class="mobile-menu">
      <li v-for="link in links" :key="link.path">
        <router-link 
          :to="link.path"
          @click="isMenuOpen = false"
        >
          {{ link.name }}
        </router-link>
      </li>
      <li v-if="authStore.isAuthenticated">
        <button class="logout-button" @click="logout">Déconnexion</button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
  .navbar {
    width: 100%;
    background-color: #000;
    color: white;
    padding: 15px 6px;
    display: flex;
    justify-content: space-between;
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
  }

  .nav-links li {
    display: inline;
  }

  .nav-links a {
    text-decoration: none;
    color: white;
    padding: 10px 15px;
    border-radius: 4px;
  }

  .nav-links a:hover {
    background-color: #333;
  }

  .nav-links .active {
    background-color: #444;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 0px;
  }

  .logout-button, .login-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    padding: 10px;
    font-size: 12px;
  }

  .logout-button:hover, .login-button:hover {
    background-color: #333;
    border-radius: 4px;
  }

  .burger-menu {
    display: none;
    font-size: 24px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
  }

  .mobile-menu {
    display: none;
  }

  .profilImage {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #ddd;
  }

  @media screen and (max-width: 768px) {
    .burger-menu {
      display: block;
    }

    .nav-links {
      display: none;
    }

    .nav-right {
      margin-left: auto;
    }

    .mobile-menu {
      display: flex;
      flex-direction: column;
      background-color: #000;
      position: absolute;
      top: 45px;
      left: 0;
      width: 100%;
      padding: 10px 0;
      text-align: center;
    }

    .mobile-menu li {
      padding: 10px 0;
    }

    .mobile-menu a {
      text-decoration: none;
      color: white;
      padding: 10px 15px;
      border-radius: 4px;
    }

    .mobile-menu a:hover {
      background-color: #333;
    }

    .mobile-menu .active {
      background-color: #444;
    }

    .nav-right .logout-button {
      display: none;
    }
  }
</style>
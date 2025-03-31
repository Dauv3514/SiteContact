<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import axios from "axios"

  const username = ref('')
  const password = ref('')
  const email = ref('')
  const router = useRouter()
  const authStore = useAuthStore()

  const handleSubmit = async () => {
    try {
      const url = `http://localhost:3000/api/auth/inscription`;
      
      const payload = {
        username: username.value,
        email: email.value,
        password: password.value
      };

      const response = await axios.post(url, payload);
      if (response.data.success) {
        authStore.user = response.data.user;
        router.push('/');
      } else {
        console.error('Erreur lors de l\'inscription:', response.data.message);
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error.message);
    }
  };
</script>

<template>
<div class="login-page">
    <div class="form">
      <h1>S'inscrire</h1>
      <form class="register-form">
        <input type="text"  autocomplete="text" placeholder="Nom d'utilisateur" v-model="username"/>
        <input type="email"  autocomplete="email" placeholder="Email" v-model="email"/>
        <input type="password"  autocomplete="password" placeholder="Mot de passe" v-model="password"/>
        <button @click.prevent="handleSubmit">S'inscrire</button>
        <p class="message">
          Déjà inscrit ? 
          <router-link to="/connexion">Se connecter</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
  .login-page {
    width: 360px;
    padding: 20% 0 0;
    margin: auto;
  }

  .form {
    position: relative;
    z-index: 1;
    background: #FFFFFF;
    max-width: 360px;
    margin: 0 auto 100px;
    padding: 45px;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    border-radius: 8px;
  }

  .form h1 {
    margin: 0 0 30px;
    color: #333;
    font-size: 24px;
    font-weight: 500;
  }

  .form input {
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
    border-radius: 4px;
  }

  .form button {
    text-transform: uppercase;
    outline: 0;
    background: #333;
    width: 100%;
    border: 0;
    padding: 15px;
    color: #FFFFFF;
    font-size: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 10px;
  }

  .form button:hover {
    background: #333;
  }

  .form .message {
    margin: 15px 0 0;
    color: #b3b3b3;
    font-size: 12px;
  }

  .form .message a {
    color: #333;
    text-decoration: none;
    font-weight: 600;
  }

  .form p {
    color: #333;
  }

  .profile-icon {
    height: 40px;
    width: 40px;
  }

  @media (max-width: 400px) {
    .login-page {
      width: 90%;
      padding-top: 20%;
    }
    
    .form {
      padding: 30px;
    }
    .error-message {
      color: #ff4444;
      margin-bottom: 20px;
      font-size: 14px;
      background: #ffebee;
      padding: 10px;
      border-radius: 4px;
    }
  }
</style>
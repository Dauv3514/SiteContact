<script setup>
  import { ref, onMounted, computed } from "vue";
  import axios from "axios";
  import {useRouter} from 'vue-router';
  import { useChatStore } from '../stores/chat';

  const router = useRouter();
  const usersConnected = ref([]);
  const chatStore = useChatStore();

  const numberOfUsersConnected = computed(() => 
    usersConnected.value.length
  );

  onMounted(async () => {
    try {
      const apiUrl = "http://localhost:3000/api/users/getAll";
      const response = await axios.get(apiUrl);

      if (response.data.success) {
        usersConnected.value = response.data.users;
      }
    } catch (error) {
      console.error("Erreur de récupération des utilisateurs connectés:", error);
    }
  });

  const getProfileImage = (profileImage) => {
    if(!profileImage) {
      return 'https://static.vecteezy.com/ti/vecteur-libre/t1/2318271-icone-de-profil-utilisateur-vectoriel.jpg';
    }
    return `http://localhost:3000/api/uploads/${profileImage}`;
  }

  const chat = (user) => {
    chatStore.setTargetUser(user);
    router.push({name: 'chat'});
  }
</script>

<template>
  <div class="users-connected-container">
    <div class="users-header">
      <h3>Utilisateurs connectés</h3>
      <span class="online-count">{{ numberOfUsersConnected }} en ligne</span>
    </div>
    
    <div class="users-list">
      <div 
        class="user-item"
        v-for="user in usersConnected" 
        :key="user.id"
        @click="chat(user)"
      >
        <img 
          :src="getProfileImage(user.profile_image)" 
          :alt="`Photo de profil de ${user.username}`"
          class="user-avatar"
        />
        <div class="user-info">
          <span class="username">{{user.username}}</span>
          <span class="status-dot"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .users-connected-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    width: 250px;
    position: fixed;
    right: 2rem;
    top: 100px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }

  .users-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
  }

  .users-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
  }

  .online-count {
    background: #4CAF50;
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
  }

  .users-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .user-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background-color 0.2s;
    cursor: pointer;
  }

  .user-item:hover {
    background-color: #f5f5f5;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 0.8rem;
    object-fit: cover;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .username {
    font-size: 0.9rem;
    color: #333;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    background-color: #4CAF50;
    border-radius: 50%;
  }

  @media (max-width: 1700px) {
    .users-connected-container {
      position: static;
      width: 100%;
      margin-top: 1rem;
    }
  }
</style>
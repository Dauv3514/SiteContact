<script setup>
    import { useSocketStore } from '../stores/socket';
    import { useChatStore } from '../stores/chat';
    import { onMounted, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router';

    const socketStore = useSocketStore();
    const chatStore = useChatStore();
    const router = useRouter();

    if (!chatStore.targetUser) {
        router.push({ name: 'home' });
    }

    const getProfileImage = (profileImage) => {
        if(!profileImage) {
            return 'https://static.vecteezy.com/ti/vecteur-libre/t1/2318271-icone-de-profil-utilisateur-vectoriel.jpg';
        }
        return `http://localhost:3000/api/uploads/${profileImage}`;
    };

    onMounted(() => {
        socketStore.initSocket();
    });
    onUnmounted(() => {
        socketStore.socket?.disconnect();
    });
</script>

<template>
    <div class="chat-container">
        <nav class="navbar">
            <div class="connection-status">
                <span :class="{ 
                    'status-indicator': true,
                    'connected': socketStore.isConnected,
                    'disconnected': !socketStore.isConnected 
                }"></span>
                {{ socketStore.isConnected ? 'Tu es connecté' : 'Tu es deconnecté' }}
                <div v-if="chatStore.targetUser" class="chat-user-info">
                    <img 
                        :src="getProfileImage(chatStore.targetUser.profile_image)" 
                        :alt="chatStore.targetUser.username"
                        class="user-avatar"
                    />
                    <span class="username">Discussion avec {{ chatStore.targetUser.username }}</span>
                </div>
            </div>
        </nav>

        <div class="chat-content">
            <div class="messages-container" ref="messagesContainer">
                <div class="message-list">
                </div>
            </div>

            <div class="chat-input-container">
                <input 
                    type="text" 
                    class="message-input"
                    placeholder="Écrivez votre message..."
                />
                <button class="send-button">
                    Envoyer
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .chat-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #f5f5f5;
    }

    .navbar {
        background-color: #fff;
        border-bottom: 1px solid #e0e0e0;
        padding: 0.5rem 1rem;
    }

    .connection-status {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
    }

    .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .connected {
        background-color: #4CAF50;
    }

    .disconnected {
        background-color: #f44336;
    }

    .chat-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
    }

    .messages-container {
        flex: 1;
        overflow-y: auto;
        background-color: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 4px #333;
    }

    .message-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .chat-input-container {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px #333;
    }

    .message-input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 1rem;
    }

    .send-button {
        padding: 0.75rem 1.5rem;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .send-button:hover {
        background-color: #333;
    }

    .send-button:active {
        background-color: #333;
    }

    .chat-user-info {
        display: flex;
        align-items: center;
        margin-left: 1rem;
        padding-left: 1rem;
        border-left: 1px solid #e0e0e0;
    }

    .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 0.8rem;
        object-fit: cover;
    }

    .username {
        color: #333;
        font-weight: 500;
    }
</style>
<script setup>
    import { useSocketStore } from '../stores/socket';
    import { onMounted, onUnmounted } from 'vue';

    const socketStore = useSocketStore();
    onMounted(() => {
        socketStore.initSocket();
    });
    onUnmounted(() => {
        socketStore.socket?.disconnect();
    });
</script>

<template>
    <div class="chat-container">
        <h1>Chat</h1>
        <nav class="navbar">
        <div class="connection-status">
            <span :class="{ 
                'status-indicator': true,
                'connected': socketStore.isConnected,
                'disconnected': !socketStore.isConnected 
            }"></span>
            {{ socketStore.isConnected ? 'Connecté' : 'Déconnecté' }}
        </div>
        </nav>
    </div>
</template>
  
<style scoped>
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
</style>
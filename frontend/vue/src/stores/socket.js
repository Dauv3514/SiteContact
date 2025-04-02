import { defineStore } from 'pinia';
import { io } from "socket.io-client";
import { ref } from 'vue';
import { useAuthStore } from './auth';

export const useSocketStore = defineStore('socket', () => {
    const socket = ref(null);
    const isConnected = ref(false);
    const authStore = useAuthStore();

    const initSocket = () => {
        if (!authStore.isAuthenticated || !authStore.token) {
            console.log('❌ Authentification manquante');
            return;
        }

        socket.value = io("http://localhost:3000", {
            auth: { 
                token: authStore.token
            }
        });

        socket.value.on("connect", () => {
            console.log("✅ Connecté au WebSocket");
            isConnected.value = true;
        });

        socket.value.on("disconnect", () => {
            console.log("❌ Déconnecté du WebSocket");
            isConnected.value = false;
        });

        socket.value.on("connect_error", (error) => {
            console.error("Erreur de connexion:", error);
            isConnected.value = false;
        });
    };

    return { 
        socket, 
        initSocket,
        isConnected
    };
});
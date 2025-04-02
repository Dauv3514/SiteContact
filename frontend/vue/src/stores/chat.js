import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chat', () => {
    const targetUser = ref(null);
    const setTargetUser = (user) => {
        targetUser.value = user;
    }
    const clearChat = () => {
        targetUser.value = null;
    }
    return {
        targetUser,
        setTargetUser,
        clearChat
    }
});
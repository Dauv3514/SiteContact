import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chat', () => {
    const targetUser = ref(null);
    const messages = ref([]);

    const setTargetUser = (user) => {
        targetUser.value = user;
        messages.value = [];
    }

    const addMessage = (message) => {
        messages.value.push({
            ...message,
            timestamp: message.timestamp || new Date()
        });
    }

    const setMessages = (newMessages) => {
        messages.value = newMessages.map(message => ({
            ...message,
            isOwn: message.isOwn || false
        }));
    };

    const clearChat = () => {
        targetUser.value = null;
        messages.value = [];
    }

    return {
        targetUser,
        messages,
        setTargetUser,
        clearChat,
        addMessage,
        setMessages
    }
});
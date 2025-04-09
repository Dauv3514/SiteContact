<script setup>
    import { useSocketStore } from '../stores/socket';
    import { useChatStore } from '../stores/chat';
    import { ref, onMounted, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router';

    const socketStore = useSocketStore();
    const chatStore = useChatStore();
    const router = useRouter();
    const messageInput = ref('');
    const fileInput = ref(null);
    const selectedFile = ref(null);

    if (!chatStore.targetUser) {
        router.push({ name: 'home' });
    }

    const loadMessageHistory = () => {
        if(!chatStore.targetUser) return;
        socketStore.socket.emit('fetchMessages', {
            userId: chatStore.targetUser.id
        })
    }

    const getProfileImage = (profileImage) => {
        if(!profileImage) {
            return 'https://static.vecteezy.com/ti/vecteur-libre/t1/2318271-icone-de-profil-utilisateur-vectoriel.jpg';
        }
        return `http://localhost:3000/api/uploads/${profileImage}`;
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !file.name.endsWith('.csv')) {
            alert('Veuillez sélectionner un fichier CSV');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            selectedFile.value = {
                name: file.name,
                data: new Uint8Array(reader.result)
            };
        };
        reader.readAsArrayBuffer(file);
    }

    const downloadFile = (fileName) => {
        console.log('Téléchargement du fichier:', fileName);
    }   

    const sendMessage = () => {
        if(!messageInput.value.trim() && !selectedFile.value) {
            return;
        };
        // Créer le message
        const messageData = {
            recipient_id: chatStore.targetUser.id,
            content: messageInput.value.trim(),
            file: selectedFile.value ? {
                name: selectedFile.value.name,
                data: Array.from(selectedFile.value.data)
            } : null
        };

        socketStore.socket.emit('chat message', messageData);

        chatStore.addMessage({
            content: messageInput.value.trim(),
            fileName: selectedFile.value?.name,
            isOwn: true
        });
        
        messageInput.value = '';
        selectedFile.value = null;
        if (fileInput.value) {
            fileInput.value.value = '';
        }
    };

    onMounted(() => {
        socketStore.initSocket();
        socketStore.socket?.on('connect', () => {
            loadMessageHistory();
        });
        socketStore.socket?.on('private_message', (message) => {
            chatStore.addMessage({
                ...message,
                isOwn: false
            });
        });
        socketStore.socket?.on('message_history', (messages) => {
            chatStore.setMessages(messages);
        })
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
                    <div 
                        v-for="message in chatStore.messages"
                        :key="message.id"
                        :class="['message', message.isOwn ? 'message-sent' : 'message-received']"
                    >
                        <template v-if="message.fileName && message.content">
                            <div class="message-content">{{ message.content }}</div>
                            <div class="file-attachment">
                                <button @click="downloadFile(message.fileName)" class="download-button">
                                    📎 {{ message.fileName }}
                                </button>
                            </div>
                        </template>
                        <template v-else-if="message.fileName">
                            <button @click="downloadFile(message.fileName)" class="download-button">
                                📎 {{ message.fileName }}
                            </button>
                        </template>
                        <template v-else>
                            {{ message.content }}
                        </template>
                    </div>
                </div>
            </div>

            <div class="chat-input-container">
                <input
                    type="file"
                    accept=".csv"
                    ref="fileInput"
                    @change="handleFileUpload"
                    class="hidden"
                />
                <button @click="$refs.fileInput.click()" class="file-button">
                    📎 CSV
                </button>
                <span v-if="selectedFile" class="selected-file">
                    {{ selectedFile.name }}
                </span>
                <input
                    v-model="messageInput"
                    type="text" 
                    class="message-input"
                    @keyup.enter="sendMessage"
                    placeholder="Écrivez votre message..."
                />
                <button @click="sendMessage" class="send-button">
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

    .message {
        padding: 10px;
        margin: 8px;
        max-width: 70%;
        border-radius: 10px;
    }

    .message-sent {
        background-color: #333;
        color: white;
        align-self: flex-end;
        margin-left: auto;
    }

    .message-received {
        background-color: #e9ecef;
        color: #333;
        align-self: flex-start;
        margin-right: auto;
    }

    .hidden {
        display: none;
    }

    .file-button {
        padding: 0.75rem;
        background-color: #f0f0f0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .selected-file {
        display: flex;
        align-items: center;
        font-size: 0.8em;
        color: #666;
        margin-left: 8px;
    }

    .message-content {
        margin-bottom: 8px;
    }

    .file-attachment {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 8px;
        margin-top: 8px;
    }

    .message-sent .file-attachment {
        border-color: rgba(255, 255, 255, 0.1);
    }

    .message-received .file-attachment {
        border-color: rgba(0, 0, 0, 0.1);
    }

    .download-button {
        display: block;
        margin-top: 4px;
        padding: 4px 8px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9em;
    }
</style>
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null
    }),
    getters: {
        isAuthenticated: (state) => {
            return !!state.user && !!state.token; 
        }
    },
    actions: {
        async fetchUser() {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/me'); 
                this.user = response.data.user;
                this.token = response.data.token;
            } catch (error) {
                this.user = null;
            }
        },
        async logout() {
            try {
                await axios.post('http://localhost:3000/api/auth/deconnexion');
                this.user = null;
                this.token = null;
            } catch (error) {
                console.error("Erreur lors de la déconnexion", error);
            }
        }
    }

})
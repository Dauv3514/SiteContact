import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null
    }),
    getters: {
        isAuthenticated: (state) => {
            return !!state.user;
        }
    },
    actions: {
        async fetchUser() {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/me', { withCredentials: true }); 
                this.user = response.data.user;
            } catch (error) {
                this.user = null;
            }
        },
        async logout() {
            try {
                await axios.post('http://localhost:3000/api/auth/deconnexion', {}, { withCredentials: true });
                this.user = null;
            } catch (error) {
                console.error("Erreur lors de la déconnexion", error);
            }
        }
    }

})
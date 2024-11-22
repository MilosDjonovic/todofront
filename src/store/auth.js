import { defineStore } from 'pinia';
import { authApi } from '@/api/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: !!localStorage.getItem('token')
    }),
    actions: {
        async login(credentials) {
            try {
                const response = await authApi.login(credentials);
                this.token = response.data.token;
                this.user = response.data.user;
                this.isAuthenticated = true;
                localStorage.setItem('token', this.token);
                return response;
            } catch (error) {
                this.user = null;
                this.token = null;
                this.isAuthenticated = false;
                localStorage.removeItem('token');
                throw error;
            }
        },
        async register(userData) {
            try {
                const response = await authApi.register(userData);
                this.user = response.data.user;
                this.isAuthenticated = true;
                return response;
            } catch (error) {
                throw error;
            }
        },
        async fetchUser() {
            console.log('fetchUser');
            try {
                const response = await authApi.getUser();
                this.user = response.data;
                this.isAuthenticated = true;
                return response;
            } catch (error) {
                this.user = null;
                this.isAuthenticated = false;
                localStorage.removeItem('token');
                throw error;
            }
        },

        async logout() {
            try {
                await authApi.logout();
            } finally {
                this.user = null;
                this.token = null;
                this.isAuthenticated = false;
                localStorage.removeItem('token');
            }
        }
    }
});
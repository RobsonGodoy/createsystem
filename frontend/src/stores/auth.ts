import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email,
          password,
        });

        this.token = response.data.token;
        this.user = response.data.user;

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return true;
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        return false;
      }
    },

    async register(name: string, email: string, password: string) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          name,
          email,
          password,
        });

        this.token = response.data.token;
        this.user = response.data.user;

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return true;
      } catch (error) {
        console.error('Erro ao registrar:', error);
        return false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
}); 
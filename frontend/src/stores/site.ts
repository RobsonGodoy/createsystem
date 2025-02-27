import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

interface Site {
  id: number;
  name: string;
  layout: Array<{
    type: string;
    props: Record<string, any>;
    id: number;
  }>;
  isPublished: boolean;
  buildPath?: string;
  createdAt: string;
  updatedAt: string;
}

interface SiteState {
  sites: Site[];
  currentSite: Site | null;
  loading: boolean;
  error: string | null;
}

export const useSiteStore = defineStore('site', {
  state: (): SiteState => ({
    sites: [],
    currentSite: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSites() {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('http://localhost:3000/api/sites', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        this.sites = response.data;
      } catch (error) {
        console.error('Erro ao buscar sites:', error);
        this.error = 'Erro ao carregar os sites';
      } finally {
        this.loading = false;
      }
    },

    async fetchSite(id: number) {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`http://localhost:3000/api/sites/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        this.currentSite = response.data;
      } catch (error) {
        console.error('Erro ao buscar site:', error);
        this.error = 'Erro ao carregar o site';
      } finally {
        this.loading = false;
      }
    },

    async createSite(name: string, layout: any) {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(
          'http://localhost:3000/api/sites',
          { name, layout },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );

        this.sites.unshift(response.data);
        return response.data;
      } catch (error) {
        console.error('Erro ao criar site:', error);
        this.error = 'Erro ao criar o site';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateSite(id: number, name: string, layout: any) {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.put(
          `http://localhost:3000/api/sites/${id}`,
          { name, layout },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );

        const index = this.sites.findIndex((site) => site.id === id);
        if (index !== -1) {
          this.sites[index] = response.data;
        }

        this.currentSite = response.data;
        return response.data;
      } catch (error) {
        console.error('Erro ao atualizar site:', error);
        this.error = 'Erro ao atualizar o site';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteSite(id: number) {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        await axios.delete(`http://localhost:3000/api/sites/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        this.sites = this.sites.filter((site) => site.id !== id);
        if (this.currentSite?.id === id) {
          this.currentSite = null;
        }

        return true;
      } catch (error) {
        console.error('Erro ao excluir site:', error);
        this.error = 'Erro ao excluir o site';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async publishSite(id: number) {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(
          `http://localhost:3000/api/sites/${id}/publish`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );

        const index = this.sites.findIndex((site) => site.id === id);
        if (index !== -1) {
          this.sites[index] = response.data;
        }

        if (this.currentSite?.id === id) {
          this.currentSite = response.data;
        }

        return response.data;
      } catch (error) {
        console.error('Erro ao publicar site:', error);
        this.error = 'Erro ao publicar o site';
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
}); 
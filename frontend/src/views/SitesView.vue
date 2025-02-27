<template>
  <v-container fluid class="sites-container pa-0">
    <!-- Header futurista -->
    <v-row class="tech-header px-4 py-2 mb-6">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="showNewSiteDialog = true"
            class="tech-button"
          >
            Novo Site
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="siteStore.loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>

    <v-row v-else-if="siteStore.error">
      <v-col cols="12">
        <v-alert type="error" text>
          {{ siteStore.error }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="siteStore.sites.length === 0">
      <v-col cols="12">
        <v-alert type="info" text>
          Você ainda não tem nenhum site. Clique em "Novo Site" para começar!
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="site in siteStore.sites"
        :key="site.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="tech-card">
          <v-img
            :src="getPreviewImage(site)"
            height="200"
            cover
            class="bg-grey-lighten-2"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-icon size="large" color="grey-lighten-1">mdi-web</v-icon>
              </v-row>
            </template>
            <div class="tech-overlay">
              <div class="tech-lines"></div>
            </div>
          </v-img>

          <v-card-title class="tech-title">{{ site.name }}</v-card-title>

          <v-card-text>
            <v-chip
              :color="site.isPublished ? 'success' : 'warning'"
              size="small"
              class="mb-2 tech-chip"
            >
              {{ site.isPublished ? 'Publicado' : 'Rascunho' }}
            </v-chip>
            <div class="text-caption tech-text">
              Última atualização: {{ formatDate(site.updatedAt) }}
            </div>
          </v-card-text>

          <v-card-actions class="tech-actions">
            <v-btn
              variant="text"
              color="white"
              @click="router.push(`/editor/${site.id}`)"
              class="tech-button"
            >
              <v-icon color="white" start>mdi-pencil</v-icon>
              Editar
            </v-btn>
            <v-btn
              v-if="site.isPublished"
              variant="text"
              color="success"
              @click="handleViewSite(site.buildPath)"
              class="tech-button"
            >
              <v-icon start>mdi-eye</v-icon>
              Visualizar
            </v-btn>
            <v-spacer />
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" class="tech-button">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list class="tech-menu">
                <v-list-item
                  v-if="!site.isPublished"
                  @click="handlePublish(site.id)"
                  class="tech-menu-item"
                >
                  <v-list-item-title>
                    <v-icon start>mdi-publish</v-icon>
                    Publicar
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleDelete(site)" class="tech-menu-item">
                  <v-list-item-title class="text-error">
                    <v-icon start color="error">mdi-delete</v-icon>
                    Excluir
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para criar novo site -->
    <v-dialog v-model="showNewSiteDialog" max-width="500px" class="tech-dialog">
      <v-card class="tech-dialog-card">
        <div class="tech-dialog-header">
          <v-icon size="28" color="primary" class="mr-2">mdi-plus-circle</v-icon>
          <span class="text-h5 tech-text">Novo Site</span>
        </div>
        <v-card-text class="tech-dialog-content">
          <v-form ref="form" v-model="valid" @submit.prevent="handleCreateSite">
            <v-text-field
              v-model="newSiteName"
              :rules="nameRules"
              label="Nome do Site"
              required
              class="tech-input"
              variant="outlined"
              color="primary"
              bg-color="var(--background-light)"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="tech-dialog-actions">
          <v-spacer />
          <v-btn
            variant="outlined"
            color="primary"
            @click="showNewSiteDialog = false"
            class="tech-button mr-2"
          >
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="creating"
            @click="handleCreateSite"
            class="tech-button"
          >
            <v-icon start>mdi-check</v-icon>
            Criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmação de exclusão -->
    <v-dialog v-model="showDeleteDialog" max-width="400px" class="tech-dialog">
      <v-card class="tech-dialog-card">
        <div class="tech-dialog-header tech-dialog-header-danger">
          <v-icon size="28" color="error" class="mr-2">mdi-alert</v-icon>
          <span class="text-h5 tech-text">Confirmar Exclusão</span>
        </div>
        <v-card-text class="tech-dialog-content">
          <div class="d-flex align-center mb-4">
            <v-icon color="error" size="20" class="mr-2">mdi-delete</v-icon>
            <span class="tech-text">
              Tem certeza que deseja excluir o site "{{ siteToDelete?.name }}"?
            </span>
          </div>
          <div class="text-caption tech-text-secondary">
            Esta ação não pode ser desfeita.
          </div>
        </v-card-text>
        <v-card-actions class="tech-dialog-actions">
          <v-spacer />
          <v-btn
            variant="outlined"
            color="primary"
            @click="showDeleteDialog = false"
            class="tech-button mr-2"
          >
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            :loading="deleting"
            @click="confirmDelete"
            class="tech-button"
          >
            <v-icon start>mdi-delete</v-icon>
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Substituir o diálogo de loading pelo JarvisLoader -->
    <JarvisLoader
      :show="isLoading"
      :message="loadingMessage"
      sub-message="Carregando site..."
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSiteStore } from '@/stores/site';
import JarvisLoader from '@/components/JarvisLoader.vue';

const router = useRouter();
const siteStore = useSiteStore();

interface Site {
  id: number;
  name: string;
  buildPath?: string;
  isPublished: boolean;
  updatedAt: string;
  layout: Array<{
    type: string;
    props: Record<string, any>;
    id: number;
  }>;
}

const showNewSiteDialog = ref(false);
const showDeleteDialog = ref(false);
const valid = ref(false);
const creating = ref(false);
const deleting = ref(false);
const newSiteName = ref('');
const siteToDelete = ref<Site | null>(null);
const isLoading = ref(false);
const loadingMessage = ref('');

// Computed property para a URL da API
const apiUrl = computed(() => import.meta.env.VITE_API_URL);

// Adicionar nova função para gerar a URL completa do site
const getSiteUrl = (buildPath: string) => {
  return `${apiUrl.value}${buildPath}`;
};

const nameRules = [
  (v: string) => !!v || 'Nome é obrigatório',
  (v: string) => v.length >= 3 || 'Nome deve ter no mínimo 3 caracteres',
];

onMounted(() => {
  siteStore.fetchSites();
});

const getPreviewImage = (site: any) => {
  // TODO: Implementar geração de preview
  return '';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const handleCreateSite = async () => {
  if (!valid.value) return;

  creating.value = true;
  const site = await siteStore.createSite(newSiteName.value, []);

  if (site) {
    showNewSiteDialog.value = false;
    newSiteName.value = '';
    router.push(`/editor/${site.id}`);
  }

  creating.value = false;
};

const handleDelete = (site: Site) => {
  siteToDelete.value = site;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!siteToDelete.value) return;

  deleting.value = true;
  const success = await siteStore.deleteSite(siteToDelete.value.id);

  if (success) {
    showDeleteDialog.value = false;
    siteToDelete.value = null;
  }

  deleting.value = false;
};

const handlePublish = async (siteId: number) => {
  await siteStore.publishSite(siteId);
};

// Função para simular o carregamento com mensagens
const simulateLoading = async () => {
  const messages = [
    'INICIANDO J.A.R.V.I.S',
    'CARREGANDO INTERFACE',
    'ESTABELECENDO CONEXÃO',
    'PREPARANDO VISUALIZAÇÃO',
    'INICIALIZANDO SISTEMA'
  ];

  for (const message of messages) {
    loadingMessage.value = message;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

// Função para visualizar o site
const handleViewSite = async (buildPath: string) => {
  try {
    isLoading.value = true;
    await simulateLoading();
  } finally {
    isLoading.value = false;
    window.location.href = getSiteUrl(buildPath);
  }
};
</script>

<style scoped>
.sites-container {
  background-color: var(--background-dark);
  min-height: 100vh;
}

.tech-header {
  background: linear-gradient(90deg, var(--background-dark) 0%, var(--primary-color-dark) 100%);
  border-bottom: 2px solid var(--primary-color);
  box-shadow: 0 2px 12px rgba(41, 182, 246, 0.2);
}

.tech-text {
  color: var(--text-primary);
  text-shadow: 0 0 10px rgba(41, 182, 246, 0.5);
}

.tech-card {
  background: var(--background-light);
  border: 1px solid var(--primary-color);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tech-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(41, 182, 246, 0.2);
}

.tech-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--primary-color), transparent);
  z-index: -1;
  animation: borderGlow 2s ease-in-out infinite;
}

.tech-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 38, 52, 0.7);
}

.tech-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent 0,
    transparent 50px,
    rgba(41, 182, 246, 0.1) 50px,
    rgba(41, 182, 246, 0.1) 51px
  );
  animation: moveLines 20s linear infinite;
}

.tech-title {
  color: var(--text-primary);
  font-weight: bold;
  border-bottom: 1px solid var(--primary-color);
}

.tech-chip {
  border: 1px solid currentColor;
  font-family: 'Roboto Mono', monospace;
}

.tech-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.tech-button::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(41, 182, 246, 0.1),
    transparent
  );
  transform: rotate(45deg);
  animation: buttonGlow 2s ease-in-out infinite;
}

.tech-menu {
  background: var(--background-light);
  border: 1px solid var(--primary-color);
}

.tech-menu-item {
  transition: all 0.3s ease;
}

.tech-menu-item:hover {
  background: rgba(41, 182, 246, 0.1);
}

@keyframes borderGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes moveLines {
  from { background-position: 0 0; }
  to { background-position: 100px 0; }
}

@keyframes buttonGlow {
  0% { transform: rotate(45deg) translateX(-100%); }
  100% { transform: rotate(45deg) translateX(100%); }
}

/* Estilos para os diálogos */
.tech-dialog-card {
  background: var(--background-dark);
  border: 1px solid var(--primary-color);
  box-shadow: 0 0 20px rgba(41, 182, 246, 0.2);
  overflow: hidden;
}

.tech-dialog-header {
  background: linear-gradient(90deg, var(--background-dark) 0%, var(--primary-color-dark) 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--primary-color);
}

.tech-dialog-header-danger {
  background: linear-gradient(90deg, var(--background-dark) 0%, #ff4444 100%);
}

.tech-dialog-content {
  padding: 24px;
  background: var(--background-dark);
}

.tech-dialog-actions {
  padding: 16px 24px;
  background: var(--background-dark);
  border-top: 1px solid rgba(41, 182, 246, 0.1);
}

.tech-input {
  border-color: var(--primary-color);
}

.tech-input:hover, .tech-input:focus {
  box-shadow: 0 0 10px rgba(41, 182, 246, 0.2);
}

.tech-text-secondary {
  color: var(--text-secondary);
  opacity: 0.7;
}

/* Animação de entrada para os diálogos */
.tech-dialog-enter-active,
.tech-dialog-leave-active {
  transition: all 0.3s ease;
}

.tech-dialog-enter-from,
.tech-dialog-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style> 
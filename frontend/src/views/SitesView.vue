<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1>Meus Sites</h1>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="showNewSiteDialog = true"
        >
          Novo Site
        </v-btn>
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
        <v-card>
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
          </v-img>

          <v-card-title>{{ site.name }}</v-card-title>

          <v-card-text>
            <v-chip
              :color="site.isPublished ? 'success' : 'warning'"
              size="small"
              class="mb-2"
            >
              {{ site.isPublished ? 'Publicado' : 'Rascunho' }}
            </v-chip>
            <div class="text-caption">
              Última atualização: {{ formatDate(site.updatedAt) }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              variant="text"
              color="primary"
              @click="router.push(`/editor/${site.id}`)"
            >
              Editar
            </v-btn>
            <v-btn
              v-if="site.isPublished"
              variant="text"
              color="success"
              @click="handleViewSite(site.buildPath)"
            >
              Visualizar
            </v-btn>
            <v-spacer />
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-if="!site.isPublished"
                  @click="handlePublish(site.id)"
                >
                  <v-list-item-title>
                    <v-icon start>mdi-publish</v-icon>
                    Publicar
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleDelete(site)">
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
    <v-dialog v-model="showNewSiteDialog" max-width="500px">
      <v-card>
        <v-card-title>Novo Site</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="handleCreateSite">
            <v-text-field
              v-model="newSiteName"
              :rules="nameRules"
              label="Nome do Site"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            :text="true"
            @click="showNewSiteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            :loading="creating"
            @click="handleCreateSite"
          >
            Criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmação de exclusão -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirmar Exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o site "{{ siteToDelete?.name }}"?
          Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            :text="true"
            @click="showDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            :loading="deleting"
            @click="confirmDelete"
          >
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
/* Remover todos os estilos antigos do loading */
</style> 
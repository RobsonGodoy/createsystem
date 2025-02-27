<template>
  <div class="editor-container">
    <!-- Barra de ferramentas superior -->
    <v-app-bar flat border>
      <v-btn icon @click="router.push('/sites')" class="mr-4">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      
      <v-text-field
        v-model="siteName"
        density="compact"
        hide-details
        variant="underlined"
        placeholder="Nome do Site"
        class="mx-4 site-name-input"
        style="max-width: 300px"
      />

      <v-spacer />

      <v-btn
        prepend-icon="mdi-eye"
        variant="text"
        class="mr-2"
        @click="handlePreview"
      >
        Visualizar
      </v-btn>

      <v-btn
        color="primary"
        :loading="saving"
        prepend-icon="mdi-content-save"
        variant="tonal"
        class="mr-2"
        @click="handleSave"
      >
        Salvar
      </v-btn>

      <v-btn
        v-if="!site?.isPublished"
        color="success"
        :loading="publishing"
        prepend-icon="mdi-publish"
        @click="handlePublish"
      >
        Publicar
      </v-btn>
    </v-app-bar>

    <!-- Container principal -->
    <div class="editor-content">
      <!-- Painel lateral de componentes -->
      <v-navigation-drawer
        permanent
        location="left"
        width="300"
        class="components-drawer"
        elevation="1"
      >
        <v-toolbar
          color="primary"
          class="px-4 py-1"
        >
          <v-toolbar-title class="text-white">Componentes</v-toolbar-title>
        </v-toolbar>

        <v-container class="pa-4">
          <v-text-field
            v-model="searchComponent"
            prepend-inner-icon="mdi-magnify"
            label="Buscar componente"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-4"
          />
        </v-container>

        <v-list>
          <v-list-subheader>ELEMENTOS</v-list-subheader>
          <v-list-item
            v-for="component in filteredComponents"
            :key="component.type"
            :title="component.name"
            class="component-item mb-2 mx-2"
            rounded="lg"
            draggable="true"
            @dragstart="handleDragStart($event, component)"
          >
            <template v-slot:prepend>
              <v-icon :icon="component.icon" color="primary" />
            </template>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Área de edição -->
      <div class="editor-main">
        <!-- Canvas do editor -->
        <div 
          class="editor-canvas"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <div v-if="layout.length === 0" class="empty-state">
            <v-icon size="64" color="grey-lighten-1">mdi-puzzle-outline</v-icon>
            <div class="text-h6 mt-4 text-grey-darken-1">
              Arraste componentes aqui
            </div>
            <div class="text-body-2 text-grey-darken-1">
              para começar a construir seu site
            </div>
          </div>

          <draggable
            v-model="layout"
            :group="{ name: 'components', pull: true, put: true }"
            item-key="id"
            class="layout-container"
            ghost-class="ghost"
            :animation="200"
            @add="handleAdd"
            @start="handleDragStart"
            @end="handleDragEnd"
          >
            <template #item="{ element, index }">
              <div 
                class="component-wrapper"
                :class="[
                  `width-${(element.layout || {}).width || '100'}`,
                  { 'new-row': (element.layout || {}).newRow }
                ]"
                :style="{
                  padding: `${(element.layout || {}).padding || 16}px`,
                  marginBottom: (element.layout || {}).newRow ? '16px' : '0px'
                }"
              >
                <div class="component-toolbar">
                  <v-menu
                    location="bottom end"
                    :close-on-content-click="false"
                    :close-on-click="true"
                    offset="5"
                  >
                    <template v-slot:activator="{ props }">
                      <v-btn
                        icon="mdi-cog"
                        size="small"
                        color="white"
                        variant="text"
                        v-bind="props"
                      />
                    </template>
                    <v-card min-width="250" class="pa-2">
                      <v-list>
                        <v-list-subheader>Layout</v-list-subheader>
                        <v-list-item>
                          <v-select
                            :model-value="(element.layout || {}).width || '100'"
                            :items="[
                              { title: '100%', value: '100' },
                              { title: '75%', value: '75' },
                              { title: '50%', value: '50' },
                              { title: '33%', value: '33' },
                              { title: '25%', value: '25' }
                            ]"
                            label="Largura"
                            density="compact"
                            hide-details
                            class="mb-2"
                            @click.stop
                            @update:model-value="(val) => updateComponentLayout(index, 'width', val)"
                          />
                        </v-list-item>
                        <v-list-item>
                          <v-switch
                            :model-value="(element.layout || {}).newRow || false"
                            label="Nova linha"
                            density="compact"
                            hide-details
                            @click.stop
                            @update:model-value="(val) => updateComponentLayout(index, 'newRow', val)"
                          />
                        </v-list-item>
                        <v-list-item>
                          <v-slider
                            :model-value="(element.layout || {}).padding || 16"
                            label="Espaçamento"
                            min="0"
                            max="48"
                            step="8"
                            thumb-label
                            density="compact"
                            hide-details
                            @click.stop
                            @update:model-value="(val) => updateComponentLayout(index, 'padding', val)"
                          />
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    color="white"
                    variant="text"
                    @click="openComponentEditor(element, index)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    color="white"
                    variant="text"
                    @click="removeComponent(index)"
                  />
                  <v-btn
                    icon="mdi-drag"
                    size="small"
                    color="white"
                    variant="text"
                    class="component-handle"
                  />
                </div>
                <div class="component-preview">
                  <component
                    :is="components[element.type]"
                    v-bind="element.props"
                  />
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- Painel lateral de propriedades -->
      <v-navigation-drawer
        v-model="showPropertyPanel"
        location="right"
        width="360"
        temporary
        class="properties-drawer"
      >
        <v-toolbar
          color="grey-lighten-4"
          class="px-4 py-1"
        >
          <v-toolbar-title>Editar Componente</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="showPropertyPanel = false"
          />
        </v-toolbar>

        <v-container v-if="selectedComponent">
          <component-editor
            :component="selectedComponent"
            @update="updateComponent"
          />
        </v-container>
      </v-navigation-drawer>
    </div>

    <!-- Diálogo de visualização -->
    <v-dialog v-model="showPreview" fullscreen>
      <v-card class="preview-dialog tech-bg">
        <v-toolbar color="primary" class="preview-toolbar">
          <v-btn icon @click="showPreview = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="tech-text">VISUALIZAÇÃO</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            @click="togglePreviewDevice"
            class="pulse-effect"
          >
            <v-icon>{{ previewDevice === 'mobile' ? 'mdi-monitor' : 'mdi-cellphone' }}</v-icon>
          </v-btn>
        </v-toolbar>

        <div class="preview-container pa-0">
          <div
            class="preview-frame"
            :class="[previewDevice, 'tech-card']"
          >
            <div class="preview-content">
              <template v-for="(element, index) in layout" :key="index">
                <div 
                  :class="[
                    `width-${(element.layout || {}).width || '100'}`,
                    { 'new-row': (element.layout || {}).newRow }
                  ]"
                  :style="{
                    padding: `${(element.layout || {}).padding || 16}px`,
                    marginBottom: (element.layout || {}).newRow ? '16px' : '0px',
                    float: 'left',
                    boxSizing: 'border-box',
                    position: 'relative'
                  }"
                >
                  <component
                    :is="components[element.type]"
                    v-bind="element.props"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      :color="snackbarColor"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSiteStore } from '@/stores/site';
import draggable from 'vuedraggable';
import ComponentEditor from '@/components/ComponentEditor.vue';
import HeaderBlock from '@/components/HeaderBlock.vue';
import TextBlock from '@/components/TextBlock.vue';
import ImageBlock from '@/components/ImageBlock.vue';
import ButtonBlock from '@/components/ButtonBlock.vue';
import GalleryBlock from '@/components/GalleryBlock.vue';
import ContactBlock from '@/components/ContactBlock.vue';
import FeaturesBlock from '@/components/FeaturesBlock.vue';
import TestimonialsBlock from '@/components/TestimonialsBlock.vue';
import PricingBlock from '@/components/PricingBlock.vue';
import StatsBlock from '@/components/StatsBlock.vue';

const route = useRoute();
const router = useRouter();
const siteStore = useSiteStore();

const siteName = ref('');
const layout = ref<any[]>([]);
const saving = ref(false);
const publishing = ref(false);
const showPropertyPanel = ref(false);
const selectedComponent = ref<any>(null);
const selectedComponentIndex = ref<number>(-1);
const searchComponent = ref('');
const showPreview = ref(false);
const previewDevice = ref<'desktop' | 'mobile'>('desktop');

// Adicionar refs para o snackbar
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const site = computed(() => siteStore.currentSite);

// Registrar componentes
const components = {
  header: HeaderBlock,
  text: TextBlock,
  image: ImageBlock,
  button: ButtonBlock,
  gallery: GalleryBlock,
  contact: ContactBlock,
  features: FeaturesBlock,
  testimonials: TestimonialsBlock,
  pricing: PricingBlock,
  stats: StatsBlock,
};

// Lista de componentes disponíveis
const availableComponents = [
  {
    type: 'header',
    name: 'Cabeçalho',
    icon: 'mdi-view-headline',
    defaultProps: {
      title: 'Título do Site',
      subtitle: 'Subtítulo do Site',
      alignment: 'center',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      style: 'modern', // modern, minimal, gradient
      height: 'medium', // small, medium, large
      showOverlay: false,
      overlayColor: 'rgba(0,0,0,0.4)',
      backgroundImage: '',
      buttonText: '',
      buttonUrl: '',
      buttonStyle: 'filled', // filled, outlined, text
    },
  },
  {
    type: 'text',
    name: 'Texto',
    icon: 'mdi-text',
    defaultProps: {
      content: 'Digite seu texto aqui',
      alignment: 'left',
      fontSize: '16px',
      color: '#000000',
      style: 'default', // default, card, highlight
      backgroundColor: 'transparent',
      padding: '24px',
      maxWidth: '800px',
      animation: 'none', // none, fade-in, slide-up
      highlightColor: '#f5f5f5',
      fontFamily: 'default', // default, serif, modern
    },
  },
  {
    type: 'image',
    name: 'Imagem',
    icon: 'mdi-image',
    defaultProps: {
      src: '',
      alt: '',
      width: '100%',
      height: 'auto',
      style: 'default', // default, rounded, shadow, frame
      animation: 'none', // none, fade-in, zoom
      caption: '',
      showCaption: false,
      borderRadius: '4px',
      shadow: 'none', // none, soft, medium, strong
      overlay: false,
      overlayColor: 'rgba(0,0,0,0.4)',
      overlayText: '',
    },
  },
  {
    type: 'button',
    name: 'Botão',
    icon: 'mdi-gesture-tap-button',
    defaultProps: {
      text: 'Clique Aqui',
      url: '#',
      color: 'primary',
      variant: 'elevated',
      size: 'large',
      fullWidth: false,
      icon: '',
      iconPosition: 'left', // left, right
      animation: 'none', // none, pulse, shake
      rounded: false,
      gradient: false,
      gradientColors: ['#1976D2', '#64B5F6'],
      shadow: 'medium', // none, soft, medium, strong
    },
  },
  {
    type: 'gallery',
    name: 'Galeria',
    icon: 'mdi-view-grid',
    defaultProps: {
      images: [],
      columns: 3,
      gap: '16px',
      style: 'grid', // grid, masonry, carousel
      showArrows: true,
      showDots: true,
      autoplay: false,
      interval: 5000,
      hoverEffect: 'zoom', // none, zoom, overlay
      borderRadius: '8px',
      shadow: 'soft',
      aspectRatio: '1:1', // 1:1, 4:3, 16:9, custom
      lightbox: true,
    },
  },
  {
    type: 'contact',
    name: 'Formulário de Contato',
    icon: 'mdi-email',
    defaultProps: {
      fields: ['name', 'email', 'message'],
      submitText: 'Enviar',
      submitButtonColor: 'primary',
      successMessage: 'Mensagem enviada com sucesso!',
      style: 'card', // default, card, transparent
      spacing: 'comfortable', // compact, comfortable, loose
      showIcons: true,
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      shadow: 'soft',
      animation: 'fade-in',
      recaptcha: false,
    },
  },
  {
    type: 'features',
    name: 'Recursos',
    icon: 'mdi-star',
    defaultProps: {
      items: [
        { icon: 'mdi-check', title: 'Recurso 1', description: 'Descrição do recurso 1' },
        { icon: 'mdi-check', title: 'Recurso 2', description: 'Descrição do recurso 2' },
        { icon: 'mdi-check', title: 'Recurso 3', description: 'Descrição do recurso 3' }
      ],
      columns: 3,
      style: 'card', // card, minimal, icon-top
      showIcons: true,
      iconColor: 'primary',
      backgroundColor: 'transparent',
      animation: 'fade-in',
      spacing: 'comfortable',
    },
  },
  {
    type: 'testimonials',
    name: 'Depoimentos',
    icon: 'mdi-account-group',
    defaultProps: {
      items: [
        { 
          avatar: '', 
          name: 'Nome do Cliente', 
          role: 'Cargo',
          content: 'Depoimento do cliente',
          rating: 5
        }
      ],
      style: 'card', // card, minimal, quote
      showAvatar: true,
      showRating: true,
      autoplay: true,
      interval: 5000,
      backgroundColor: '#f5f5f5',
      textColor: '#000000',
    },
  },
  {
    type: 'pricing',
    name: 'Preços',
    icon: 'mdi-currency-usd',
    defaultProps: {
      plans: [
        {
          name: 'Básico',
          price: '99',
          period: 'mês',
          features: ['Recurso 1', 'Recurso 2', 'Recurso 3'],
          buttonText: 'Começar',
          highlighted: false
        }
      ],
      style: 'card', // card, minimal, table
      currency: 'R$',
      showAnnual: true,
      columns: 3,
      backgroundColor: '#ffffff',
      highlightColor: '#f5f5f5',
    },
  },
  {
    type: 'stats',
    name: 'Estatísticas',
    icon: 'mdi-chart-bar',
    defaultProps: {
      items: [
        { value: '100+', label: 'Clientes', icon: 'mdi-account-group' },
        { value: '50+', label: 'Projetos', icon: 'mdi-briefcase' },
        { value: '5+', label: 'Anos', icon: 'mdi-calendar' }
      ],
      style: 'card', // card, minimal, bordered
      animation: 'count-up',
      columns: 3,
      showIcons: true,
      iconColor: 'primary',
      backgroundColor: 'transparent',
    },
  }
];

const filteredComponents = computed(() => {
  if (!searchComponent.value) return availableComponents;
  const search = searchComponent.value.toLowerCase();
  return availableComponents.filter(component => 
    component.name.toLowerCase().includes(search)
  );
});

onMounted(async () => {
  if (route.params.id) {
    await siteStore.fetchSite(Number(route.params.id));
    if (site.value) {
      siteName.value = site.value.name;
      layout.value = Array.isArray(site.value.layout) ? site.value.layout : [];
    }
  }
});

const handleDragStart = (event: DragEvent, component: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    const componentData = {
      type: component.type,
      props: { ...component.defaultProps },
      layout: {
        width: '100',
        newRow: false,
        padding: 16
      },
      id: Date.now(),
    };
    event.dataTransfer.setData('application/json', JSON.stringify(componentData));
  }
};

const handleDrop = (event: DragEvent) => {
  try {
    const componentData = event.dataTransfer?.getData('application/json');
    console.log('Dados recebidos no drop:', componentData);
    
    if (componentData) {
      const component = JSON.parse(componentData);
      if (!component.layout) {
        component.layout = {
          width: '100',
          newRow: false,
          padding: 16
        };
      }
      layout.value = Array.isArray(layout.value) ? [...layout.value, component] : [component];
    }
  } catch (error) {
    console.error('Erro ao processar o drop:', error);
  }
};

const openComponentEditor = (component: any, index: number) => {
  selectedComponent.value = component;
  selectedComponentIndex.value = index;
  showPropertyPanel.value = true;
};

const updateComponent = (updatedProps: any) => {
  if (selectedComponentIndex.value >= 0 && Array.isArray(layout.value)) {
    layout.value = layout.value.map((component, index) =>
      index === selectedComponentIndex.value
        ? { ...component, props: updatedProps }
        : component
    );
  }
};

const removeComponent = (index: number) => {
  layout.value = Array.isArray(layout.value) ? layout.value.filter((_, i) => i !== index) : [];
};

const handleSave = async () => {
  saving.value = true;
  try {
    console.log('Dados a serem salvos:', {
      id: route.params.id,
      name: siteName.value,
      layout: layout.value
    });
    
    if (route.params.id) {
      await siteStore.updateSite(
        Number(route.params.id),
        siteName.value,
        Array.isArray(layout.value) ? layout.value : []
      );
      snackbarText.value = 'Site atualizado com sucesso!';
    } else {
      const newSite = await siteStore.createSite(
        siteName.value,
        Array.isArray(layout.value) ? layout.value : []
      );
      if (newSite) {
        router.push(`/editor/${newSite.id}`);
        snackbarText.value = 'Site criado com sucesso!';
      }
    }
    snackbarColor.value = 'success';
  } catch (error: any) {
    console.error('Erro ao salvar site:', error);
    snackbarColor.value = 'error';
    snackbarText.value = tratarMensagemErro(error);
  } finally {
    saving.value = false;
    snackbar.value = true;
  }
};

// Função para tratar mensagens de erro
const tratarMensagemErro = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    switch (error.message) {
      case 'Network Error':
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
      case 'Request failed with status code 404':
        return 'Site não encontrado.';
      case 'Request failed with status code 403':
        return 'Você não tem permissão para realizar esta ação.';
      case 'Request failed with status code 401':
        return 'Sua sessão expirou. Por favor, faça login novamente.';
      default:
        return 'Ocorreu um erro ao salvar o site. Tente novamente.';
    }
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
};

const handlePublish = async () => {
  if (!route.params.id) return;

  publishing.value = true;
  try {
    await siteStore.publishSite(Number(route.params.id));
    snackbarText.value = 'Site publicado com sucesso!';
    snackbarColor.value = 'success';
  } catch (error: any) {
    console.error('Erro ao publicar site:', error);
    snackbarColor.value = 'error';
    snackbarText.value = tratarMensagemErro(error);
  } finally {
    publishing.value = false;
    snackbar.value = true;
  }
};

const handlePreview = () => {
  showPreview.value = true;
};

const togglePreviewDevice = () => {
  previewDevice.value = previewDevice.value === 'desktop' ? 'mobile' : 'desktop';
};

const handleAdd = (event: any) => {
  console.log('Componente adicionado ao layout:', event.item);
  if (!Array.isArray(layout.value)) {
    layout.value = [];
  }
  
  const newComponent = event.item;
  if (!newComponent.layout) {
    newComponent.layout = {
      width: '100',
      newRow: false,
      padding: 16
    };
  }
  layout.value = [...layout.value];
};

const updateComponentLayout = (index: number, property: string, value: any) => {
  if (index >= 0 && Array.isArray(layout.value)) {
    const component = layout.value[index];
    if (!component.layout) {
      component.layout = {
        width: '100',
        newRow: false,
        padding: 16
      };
    }
    
    // Cria uma cópia do layout atual
    const updatedLayout = { ...component.layout };
    updatedLayout[property] = value;
    
    // Atualiza o componente com o novo layout
    layout.value = layout.value.map((item, i) => 
      i === index ? { ...item, layout: updatedLayout } : item
    );
  }
};

const handleDragEnd = (event: any) => {
  console.log('Drag ended:', event);
};
</script>

<style scoped>
.editor-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.components-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  background-color: white;
}

.component-item {
  cursor: grab;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.component-item:hover {
  background-color: #f5f5f5;
  transform: translateY(-1px);
  border-color: var(--v-theme-primary);
}

.component-item:active {
  cursor: grabbing;
}

.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-canvas {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.layout-container {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100%;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px;
}

.layout-container.dragover {
  background-color: #e3f2fd;
  border: 2px dashed var(--v-theme-primary);
}

.component-wrapper {
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  flex-grow: 0;
  flex-shrink: 0;
}

.component-wrapper.width-100 {
  flex-basis: calc(100% - 16px);
}

.component-wrapper.width-75 {
  flex-basis: calc(75% - 16px);
}

.component-wrapper.width-50 {
  flex-basis: calc(50% - 16px);
}

.component-wrapper.width-33 {
  flex-basis: calc(33.333% - 16px);
}

.component-wrapper.width-25 {
  flex-basis: calc(25% - 16px);
}

.component-wrapper.new-row {
  flex-basis: 100%;
  margin-top: 16px;
}

.component-wrapper:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.component-toolbar {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}

.component-wrapper:hover .component-toolbar {
  opacity: 1;
}

.component-preview {
  width: 100%;
  overflow: hidden;
}

.component-handle {
  cursor: move;
}

.ghost {
  opacity: 0.5;
  background: #e3f2fd !important;
  border: 2px dashed var(--v-theme-primary) !important;
}

.preview-dialog {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background-dark);
}

.preview-toolbar {
  position: relative;
  z-index: 2;
}

.preview-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
  padding: 24px;
  position: relative;
  background-color: var(--background-dark);
}

.preview-frame {
  background: white;
  transition: all 0.3s ease;
  height: 100%;
  overflow: auto;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.preview-frame.desktop {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
}

.preview-frame.mobile {
  width: 375px;
  height: 667px;
  border-radius: 32px;
  border: 12px solid #333;
  margin: 24px auto;
  background: white;
}

.preview-content {
  min-height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: white;
}

.preview-content .width-100 {
  flex-basis: calc(100% - 16px);
}

.preview-content .width-75 {
  flex-basis: calc(75% - 16px);
}

.preview-content .width-50 {
  flex-basis: calc(50% - 16px);
}

.preview-content .width-33 {
  flex-basis: calc(33.333% - 16px);
}

.preview-content .width-25 {
  flex-basis: calc(25% - 16px);
}

.preview-content .new-row {
  flex-basis: 100%;
  margin-top: 16px;
}

.site-name-input {
  font-size: 1.2rem;
}

:deep(.v-navigation-drawer__scrim) {
  background-color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 959px) {
  .preview-content .width-75,
  .preview-content .width-50,
  .preview-content .width-33,
  .preview-content .width-25 {
    flex-basis: calc(100% - 16px);
  }
}
</style> 
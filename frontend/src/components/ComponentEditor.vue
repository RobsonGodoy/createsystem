<template>
  <div class="component-editor tech-component-form">
    <template v-if="component.type === 'header'">
      <div class="tech-form-section">
        <div class="tech-section-title">Conteúdo</div>
        <v-text-field
          v-model="localProps.title"
          label="Título"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
        <v-text-field
          v-model="localProps.subtitle"
          label="Subtítulo"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
      </div>

      <div class="tech-form-section">
        <div class="tech-section-title">Estilo</div>
        <v-select
          v-model="localProps.alignment"
          :items="alignmentOptions"
          label="Alinhamento"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
        <v-select
          v-model="localProps.style"
          :items="[
            { title: 'Moderno', value: 'modern' },
            { title: 'Minimalista', value: 'minimal' },
            { title: 'Gradiente', value: 'gradient' }
          ]"
          label="Estilo"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
        <v-select
          v-model="localProps.height"
          :items="[
            { title: 'Pequeno', value: 'small' },
            { title: 'Médio', value: 'medium' },
            { title: 'Grande', value: 'large' }
          ]"
          label="Altura"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
      </div>

      <div class="tech-form-section">
        <div class="tech-section-title">Cores</div>
        <div class="d-flex gap-4">
          <v-color-picker
            v-model="localProps.backgroundColor"
            label="Cor de Fundo"
            mode="hex"
            class="tech-color-picker"
            elevation="0"
            hide-inputs
          />
          <v-color-picker
            v-model="localProps.textColor"
            label="Cor do Texto"
            mode="hex"
            class="tech-color-picker"
            elevation="0"
            hide-inputs
          />
        </div>
      </div>
    </template>

    <template v-else-if="component.type === 'text'">
      <div class="tech-form-section">
        <div class="tech-section-title">Conteúdo</div>
        <v-textarea
          v-model="localProps.content"
          label="Texto"
          class="tech-field"
          variant="outlined"
          auto-grow
          rows="5"
        />
      </div>

      <div class="tech-form-section">
        <div class="tech-section-title">Estilo</div>
        <v-select
          v-model="localProps.alignment"
          :items="alignmentOptions"
          label="Alinhamento"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
        <v-select
          v-model="localProps.style"
          :items="[
            { title: 'Padrão', value: 'default' },
            { title: 'Cartão', value: 'card' },
            { title: 'Destaque', value: 'highlight' }
          ]"
          label="Estilo"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
        <v-select
          v-model="localProps.fontFamily"
          :items="[
            { title: 'Padrão', value: 'default' },
            { title: 'Serifada', value: 'serif' },
            { title: 'Moderna', value: 'modern' }
          ]"
          label="Fonte"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
      </div>

      <div class="tech-form-section">
        <div class="tech-section-title">Aparência</div>
        <v-slider
          v-model="localProps.fontSize"
          label="Tamanho da Fonte"
          class="tech-slider"
          min="12"
          max="48"
          step="1"
          thumb-label
          :thumb-size="20"
        />
        <v-color-picker
          v-model="localProps.color"
          label="Cor do Texto"
          mode="hex"
          class="tech-color-picker"
          elevation="0"
          hide-inputs
        />
      </div>
    </template>

    <template v-else-if="component.type === 'image'">
      <div class="tech-form-section">
        <div class="tech-section-title">Imagem</div>
        <v-text-field
          v-model="localProps.src"
          label="URL da Imagem"
          class="tech-field"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-link"
        />
        <v-text-field
          v-model="localProps.alt"
          label="Texto Alternativo"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
      </div>

      <div class="tech-form-section">
        <div class="tech-section-title">Dimensões</div>
        <v-text-field
          v-model="localProps.width"
          label="Largura"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
        <v-text-field
          v-model="localProps.height"
          label="Altura"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
      </div>

      <div class="tech-form-section">
        <div class="tech-section-title">Estilo</div>
        <v-select
          v-model="localProps.style"
          :items="[
            { title: 'Padrão', value: 'default' },
            { title: 'Arredondado', value: 'rounded' },
            { title: 'Sombra', value: 'shadow' },
            { title: 'Moldura', value: 'frame' }
          ]"
          label="Estilo"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
        <v-select
          v-model="localProps.animation"
          :items="[
            { title: 'Nenhuma', value: 'none' },
            { title: 'Fade In', value: 'fade-in' },
            { title: 'Zoom', value: 'zoom' }
          ]"
          label="Animação"
          class="tech-field"
          variant="outlined"
          density="comfortable"
        />
      </div>
    </template>

    <template v-else-if="component.type === 'button'">
      <v-text-field
        v-model="localProps.text"
        label="Texto"
      />
      <v-text-field
        v-model="localProps.url"
        label="URL"
      />
      <v-select
        v-model="localProps.color"
        :items="colorOptions"
        label="Cor"
      />
      <v-select
        v-model="localProps.variant"
        :items="variantOptions"
        label="Variante"
      />
      <v-select
        v-model="localProps.size"
        :items="sizeOptions"
        label="Tamanho"
      />
    </template>

    <template v-else-if="component.type === 'gallery'">
      <v-text-field
        v-model="localProps.columns"
        label="Número de Colunas"
        type="number"
        min="1"
        max="4"
      />
      <v-text-field
        v-model="localProps.gap"
        label="Espaçamento"
      />
      <v-divider class="my-4" />
      <div class="text-subtitle-1 mb-2">Imagens</div>
      <v-list>
        <v-list-item
          v-for="(image, index) in localProps.images"
          :key="index"
          :title="image.alt || `Imagem ${index + 1}`"
        >
          <template v-slot:prepend>
            <v-avatar size="48">
              <v-img :src="image.src" :alt="image.alt" cover />
            </v-avatar>
          </template>
          <template v-slot:append>
            <v-btn
              icon="mdi-delete"
              variant="text"
              color="error"
              size="small"
              @click="removeImage(index)"
            />
          </template>
        </v-list-item>
      </v-list>
      <v-btn
        block
        color="primary"
        prepend-icon="mdi-plus"
        class="mt-4"
        @click="addImage"
      >
        Adicionar Imagem
      </v-btn>
    </template>

    <template v-else-if="component.type === 'contact'">
      <v-select
        v-model="localProps.fields"
        :items="fieldOptions"
        label="Campos"
        multiple
        chips
      />
      <v-text-field
        v-model="localProps.submitText"
        label="Texto do Botão"
      />
      <v-select
        v-model="localProps.submitButtonColor"
        :items="colorOptions"
        label="Cor do Botão"
      />
      <v-text-field
        v-model="localProps.successMessage"
        label="Mensagem de Sucesso"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Props {
  component: {
    type: string;
    props: Record<string, any>;
  };
}

const props = defineProps<Props>();
const emit = defineEmits(['update']);

// Estado local reativo
const localProps = ref<Record<string, any>>({});

// Inicializar o estado local quando o componente é montado
onMounted(() => {
  localProps.value = { ...props.component.props };
});

// Observar mudanças no componente e atualizar o estado local
watch(() => props.component.props, (newProps) => {
  localProps.value = { ...newProps };
}, { deep: true });

const alignmentOptions = [
  { title: 'Esquerda', value: 'left' },
  { title: 'Centro', value: 'center' },
  { title: 'Direita', value: 'right' },
  { title: 'Justificado', value: 'justify' },
];

const colorOptions = [
  { title: 'Primária', value: 'primary' },
  { title: 'Secundária', value: 'secondary' },
  { title: 'Sucesso', value: 'success' },
  { title: 'Info', value: 'info' },
  { title: 'Aviso', value: 'warning' },
  { title: 'Erro', value: 'error' },
];

const variantOptions = [
  { title: 'Plano', value: 'flat' },
  { title: 'Texto', value: 'text' },
  { title: 'Elevado', value: 'elevated' },
  { title: 'Tonal', value: 'tonal' },
  { title: 'Contornado', value: 'outlined' },
  { title: 'Simples', value: 'plain' },
];

const sizeOptions = [
  { title: 'Extra Pequeno', value: 'x-small' },
  { title: 'Pequeno', value: 'small' },
  { title: 'Padrão', value: 'default' },
  { title: 'Grande', value: 'large' },
  { title: 'Extra Grande', value: 'x-large' },
];

const fieldOptions = [
  { title: 'Nome', value: 'name' },
  { title: 'E-mail', value: 'email' },
  { title: 'Mensagem', value: 'message' },
];

const updateProps = () => {
  emit('update', { ...localProps.value });
};

// Observar mudanças no estado local e emitir atualizações
watch(localProps, () => {
  updateProps();
}, { deep: true });

const addImage = () => {
  if (!localProps.value.images) {
    localProps.value.images = [];
  }
  localProps.value.images.push({
    src: '',
    alt: '',
  });
  updateProps();
};

const removeImage = (index: number) => {
  localProps.value.images.splice(index, 1);
  updateProps();
};
</script>

<style scoped>
.tech-component-form {
  color: #E1F5FE;
}

.tech-form-section {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(41, 182, 246, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(41, 182, 246, 0.1);
}

.tech-section-title {
  font-family: 'Roboto Mono', monospace;
  color: var(--primary-color);
  font-size: 0.8rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(41, 182, 246, 0.1);
}

.tech-field {
  margin-bottom: 16px;
}

.tech-field:last-child {
  margin-bottom: 0;
}

.tech-color-picker {
  background: rgba(41, 182, 246, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(41, 182, 246, 0.1);
  overflow: hidden;
}

.tech-slider {
  padding: 16px 0;
}

.tech-slider :deep(.v-slider-track__fill) {
  background: var(--primary-color) !important;
}

.tech-slider :deep(.v-slider-thumb) {
  color: var(--primary-color) !important;
  border: 2px solid var(--primary-color) !important;
}

.tech-slider :deep(.v-slider-thumb__label) {
  background: var(--primary-color) !important;
  font-family: 'Roboto Mono', monospace;
}

:deep(.v-field--focused) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 10px rgba(41, 182, 246, 0.2) !important;
}

:deep(.v-field__outline) {
  --v-field-border-opacity: 0.2 !important;
}

:deep(.v-field--variant-outlined) {
  --v-field-border-opacity: 0.2 !important;
}

:deep(.v-field__overlay) {
  background-color: rgba(41, 182, 246, 0.05) !important;
}

:deep(.v-label) {
  color: #B3E5FC !important;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

:deep(.v-field__input) {
  color: #E1F5FE !important;
}

:deep(.v-select__selection),
:deep(.v-select__selection-text) {
  color: #E1F5FE !important;
}

:deep(.v-menu__content) {
  background: var(--background-dark) !important;
  border: 1px solid var(--primary-color) !important;
}

:deep(.v-list) {
  background: transparent !important;
  color: #E1F5FE !important;
}

:deep(.v-list-item) {
  color: #E1F5FE !important;
}

:deep(.v-list-item--active) {
  background: rgba(41, 182, 246, 0.1) !important;
  color: var(--primary-color) !important;
}

:deep(.v-list-item:hover) {
  background: rgba(41, 182, 246, 0.05) !important;
}
</style> 
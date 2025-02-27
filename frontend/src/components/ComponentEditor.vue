<template>
  <div class="component-editor">
    <template v-if="component.type === 'header'">
      <v-text-field
        v-model="localProps.title"
        label="Título"
      />
      <v-text-field
        v-model="localProps.subtitle"
        label="Subtítulo"
      />
      <v-select
        v-model="localProps.alignment"
        :items="alignmentOptions"
        label="Alinhamento"
      />
      <v-color-picker
        v-model="localProps.backgroundColor"
        label="Cor de Fundo"
        mode="hex"
        hide-inputs
      />
      <v-color-picker
        v-model="localProps.textColor"
        label="Cor do Texto"
        mode="hex"
        hide-inputs
      />
    </template>

    <template v-else-if="component.type === 'text'">
      <v-textarea
        v-model="localProps.content"
        label="Conteúdo"
        auto-grow
        rows="5"
      />
      <v-select
        v-model="localProps.alignment"
        :items="alignmentOptions"
        label="Alinhamento"
      />
      <v-text-field
        v-model="localProps.fontSize"
        label="Tamanho da Fonte"
        type="number"
        suffix="px"
      />
      <v-color-picker
        v-model="localProps.color"
        label="Cor do Texto"
        mode="hex"
        hide-inputs
      />
    </template>

    <template v-else-if="component.type === 'image'">
      <v-text-field
        v-model="localProps.src"
        label="URL da Imagem"
      />
      <v-text-field
        v-model="localProps.alt"
        label="Texto Alternativo"
      />
      <v-text-field
        v-model="localProps.width"
        label="Largura"
      />
      <v-text-field
        v-model="localProps.height"
        label="Altura"
      />
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
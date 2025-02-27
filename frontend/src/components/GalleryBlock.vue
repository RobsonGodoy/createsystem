<template>
  <div class="gallery-block" :style="{ padding: '24px' }">
    <v-row :style="{ gap: props.gap }">
      <v-col
        v-for="(image, index) in props.images"
        :key="index"
        :cols="12"
        :sm="12 / props.columns"
      >
        <v-img
          :src="image.src"
          :alt="image.alt"
          aspect-ratio="1"
          cover
          class="rounded elevation-2"
        >
          <template v-slot:placeholder>
            <div class="placeholder d-flex align-center justify-center">
              <v-icon size="48" color="grey-lighten-1">mdi-image</v-icon>
            </div>
          </template>
        </v-img>
      </v-col>
    </v-row>

    <div v-if="props.images.length === 0" class="empty-gallery">
      <v-icon size="48" color="grey-lighten-1">mdi-image-multiple</v-icon>
      <div class="text-body-1 text-grey-darken-1 mt-2">
        Adicione imagens à galeria
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Image {
  src: string;
  alt: string;
}

interface Props {
  images: Image[];
  columns: number;
  gap: string;
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  columns: 3,
  gap: '16px',
});
</script>

<style scoped>
.empty-gallery {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.placeholder {
  background-color: #f5f5f5;
  height: 100%;
}
</style> 
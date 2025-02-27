<template>
  <div class="image-block" :style="{ textAlign: 'center', padding: '24px' }">
    <v-img
      :src="props.src || placeholderImage"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      :style="{ margin: '0 auto' }"
      class="rounded elevation-2"
      cover
    >
      <template v-slot:placeholder>
        <div class="placeholder d-flex align-center justify-center">
          <v-icon size="48" color="grey-lighten-1">mdi-image</v-icon>
        </div>
      </template>
    </v-img>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string;
  alt: string;
  width: string;
  height: string;
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  width: '100%',
  height: 'auto',
});

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg==';
</script>

<style scoped>
.placeholder {
  background-color: #f5f5f5;
  height: 300px;
}
</style> 
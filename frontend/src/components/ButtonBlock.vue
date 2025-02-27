<template>
  <div class="button-block" :style="{ textAlign: 'center', padding: '24px' }">
    <v-btn
      :color="props.color"
      :variant="props.variant"
      :size="props.size"
      :href="props.url"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ props.text }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  url: string;
  color: string;
  variant: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain';
  size: 'x-small' | 'small' | 'default' | 'large' | 'x-large';
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Clique Aqui',
  url: '#',
  color: 'primary',
  variant: 'elevated',
  size: 'large',
});
</script> 
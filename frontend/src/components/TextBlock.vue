<template>
  <div
    class="text-block"
    :style="{
      textAlign: props.alignment,
      color: props.color,
      fontSize: props.fontSize,
      padding: '24px',
    }"
  >
    <div v-html="formattedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  content: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  fontSize: string;
  color: string;
}

const props = withDefaults(defineProps<Props>(), {
  content: 'Digite seu texto aqui',
  alignment: 'left',
  fontSize: '16px',
  color: '#000000',
});

const formattedContent = computed(() => {
  return props.content.split('\n').map(line => `<p>${line}</p>`).join('');
});
</script>

<style scoped>
.text-block :deep(p) {
  margin: 0 0 1em;
}

.text-block :deep(p:last-child) {
  margin-bottom: 0;
}
</style> 
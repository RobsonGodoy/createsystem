<template>
  <div
    class="header-block"
    :style="{
      backgroundColor: props.backgroundColor,
      textAlign: props.alignment,
      color: props.textColor,
      padding: '48px 24px',
    }"
  >
    <h1 class="text-h2 font-weight-bold mb-4">{{ props.title }}</h1>
    <h2 class="text-h5 font-weight-regular">{{ props.subtitle }}</h2>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle: string;
  alignment: 'left' | 'center' | 'right';
  backgroundColor: string;
  textColor: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Título do Site',
  subtitle: 'Subtítulo do Site',
  alignment: 'center',
  backgroundColor: '#ffffff',
  textColor: '#000000',
});
</script> 
<template>
  <div
    class="features-block"
    :class="[props.style, props.animation]"
    :style="{
      backgroundColor: props.backgroundColor,
      padding: props.spacing === 'comfortable' ? '48px 24px' : '24px',
    }"
  >
    <v-container>
      <v-row>
        <v-col
          v-for="(item, index) in props.items"
          :key="index"
          :cols="12"
          :sm="props.columns === 2 ? 6 : 4"
          :md="12 / props.columns"
        >
          <v-card
            :variant="props.style === 'card' ? 'elevated' : 'text'"
            :class="[
              'feature-item',
              `text-${props.style === 'icon-top' ? 'center' : 'left'}`
            ]"
          >
            <v-card-item>
              <div class="feature-content">
                <v-icon
                  v-if="props.showIcons"
                  :icon="item.icon"
                  :color="props.iconColor"
                  size="large"
                  class="mb-4"
                />
                <h3 class="text-h6 mb-2">{{ item.title }}</h3>
                <p class="text-body-1 text-grey-darken-1">
                  {{ item.description }}
                </p>
              </div>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface Props {
  items: FeatureItem[];
  columns: number;
  style: 'card' | 'minimal' | 'icon-top';
  showIcons: boolean;
  iconColor: string;
  backgroundColor: string;
  animation: string;
  spacing: 'compact' | 'comfortable';
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  columns: 3,
  style: 'card',
  showIcons: true,
  iconColor: 'primary',
  backgroundColor: 'transparent',
  animation: 'fade-in',
  spacing: 'comfortable',
});
</script>

<style scoped>
.features-block {
  opacity: 0;
}

.features-block.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.feature-item {
  height: 100%;
  transition: transform 0.2s ease;
}

.feature-item:hover {
  transform: translateY(-4px);
}

.feature-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.text-center .feature-content {
  align-items: center;
  text-align: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 
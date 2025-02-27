<template>
  <div
    class="stats-block"
    :style="{
      backgroundColor: props.backgroundColor,
      padding: '48px 24px',
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
            :class="['stat-item', props.style]"
            :border="props.style === 'bordered'"
          >
            <v-card-item>
              <div class="stat-content text-center">
                <v-icon
                  v-if="props.showIcons && item.icon"
                  :icon="item.icon"
                  :color="props.iconColor"
                  size="48"
                  class="mb-4"
                />
                
                <div
                  class="stat-value text-h3 font-weight-bold mb-2"
                  :class="{ 'count-up': props.animation === 'count-up' }"
                  :data-value="item.value"
                >
                  {{ item.value }}
                </div>
                
                <div class="stat-label text-subtitle-1 text-grey-darken-1">
                  {{ item.label }}
                </div>
              </div>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

interface StatItem {
  value: string;
  label: string;
  icon?: string;
}

interface Props {
  items: StatItem[];
  style: 'card' | 'minimal' | 'bordered';
  animation: 'none' | 'count-up';
  columns: number;
  showIcons: boolean;
  iconColor: string;
  backgroundColor: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  style: 'card',
  animation: 'none',
  columns: 3,
  showIcons: true,
  iconColor: 'primary',
  backgroundColor: 'transparent',
});

onMounted(() => {
  if (props.animation === 'count-up') {
    const elements = document.querySelectorAll('.count-up');
    elements.forEach(element => {
      const target = Number(element.getAttribute('data-value')?.replace(/[^0-9]/g, ''));
      if (!isNaN(target)) {
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const interval = duration / 50;

        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            element.textContent = element.getAttribute('data-value');
            clearInterval(counter);
          } else {
            element.textContent = Math.floor(current).toString() + '+';
          }
        }, interval);
      }
    });
  }
});
</script>

<style scoped>
.stats-block {
  overflow: hidden;
}

.stat-item {
  height: 100%;
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
}

.stat-item.card {
  border-radius: 16px;
}

.stat-item.minimal {
  background: transparent !important;
  box-shadow: none !important;
}

.stat-item.bordered {
  border: 2px solid rgba(0, 0, 0, 0.12);
}

.stat-content {
  padding: 24px;
}

.stat-value {
  font-size: 3rem;
  line-height: 1;
  background: linear-gradient(45deg, var(--v-theme-primary), var(--v-theme-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (max-width: 600px) {
  .stat-value {
    font-size: 2.5rem;
  }
}
</style> 
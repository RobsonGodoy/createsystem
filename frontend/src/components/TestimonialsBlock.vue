<template>
  <div
    class="testimonials-block"
    :style="{
      backgroundColor: props.backgroundColor,
      color: props.textColor,
      padding: '48px 24px',
    }"
  >
    <v-container>
      <v-carousel
        v-if="props.items.length > 0"
        :show-arrows="props.items.length > 1"
        :continuous="true"
        :interval="props.autoplay ? props.interval : -1"
        height="auto"
        hide-delimiter-background
      >
        <v-carousel-item
          v-for="(item, index) in props.items"
          :key="index"
        >
          <v-row justify="center">
            <v-col cols="12" md="8">
              <v-card
                :variant="props.style === 'card' ? 'elevated' : 'text'"
                :class="['testimonial-item', props.style]"
              >
                <v-card-item>
                  <div class="testimonial-content">
                    <template v-if="props.style === 'quote'">
                      <v-icon
                        icon="mdi-format-quote-open"
                        size="48"
                        color="primary"
                        class="quote-icon"
                      />
                    </template>

                    <div
                      class="testimonial-text"
                      :class="{ 'with-quote': props.style === 'quote' }"
                    >
                      <p class="text-body-1 mb-4">{{ item.content }}</p>

                      <div class="testimonial-author">
                        <v-avatar
                          v-if="props.showAvatar"
                          :image="item.avatar"
                          size="48"
                          class="mr-4"
                        >
                          <v-icon v-if="!item.avatar">mdi-account</v-icon>
                        </v-avatar>

                        <div class="author-info">
                          <div class="text-subtitle-1 font-weight-bold">
                            {{ item.name }}
                          </div>
                          <div class="text-caption text-grey-darken-1">
                            {{ item.role }}
                          </div>
                        </div>
                      </div>

                      <v-rating
                        v-if="props.showRating"
                        :model-value="item.rating"
                        color="warning"
                        density="compact"
                        readonly
                        class="mt-2"
                      />
                    </div>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-container>
  </div>
</template>

<script setup lang="ts">
interface TestimonialItem {
  avatar: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface Props {
  items: TestimonialItem[];
  style: 'card' | 'minimal' | 'quote';
  showAvatar: boolean;
  showRating: boolean;
  autoplay: boolean;
  interval: number;
  backgroundColor: string;
  textColor: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  style: 'card',
  showAvatar: true,
  showRating: true,
  autoplay: true,
  interval: 5000,
  backgroundColor: '#f5f5f5',
  textColor: '#000000',
});
</script>

<style scoped>
.testimonials-block {
  overflow: hidden;
}

.testimonial-item {
  height: 100%;
  padding: 24px;
}

.testimonial-item.card {
  border-radius: 16px;
}

.testimonial-item.minimal {
  background: transparent !important;
  box-shadow: none !important;
}

.testimonial-content {
  position: relative;
}

.quote-icon {
  position: absolute;
  top: -24px;
  left: -12px;
  opacity: 0.1;
  transform: scale(2);
}

.testimonial-text {
  position: relative;
  z-index: 1;
}

.testimonial-text.with-quote {
  padding-left: 24px;
}

.testimonial-author {
  display: flex;
  align-items: center;
  margin-top: 24px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

:deep(.v-carousel__controls) {
  background: transparent;
}

:deep(.v-btn--icon.v-btn--density-default) {
  width: 48px;
  height: 48px;
}
</style> 
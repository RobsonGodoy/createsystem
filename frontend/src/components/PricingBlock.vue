<template>
  <div
    class="pricing-block"
    :style="{
      backgroundColor: props.backgroundColor,
      padding: '48px 24px',
    }"
  >
    <v-container>
      <v-row v-if="props.showAnnual" justify="center" class="mb-8">
        <v-btn-toggle
          v-model="period"
          mandatory
          rounded="pill"
          color="primary"
        >
          <v-btn value="monthly">Mensal</v-btn>
          <v-btn value="annual">
            Anual
            <v-chip
              color="success"
              size="small"
              class="ml-2"
            >
              -20%
            </v-chip>
          </v-btn>
        </v-btn-toggle>
      </v-row>

      <v-row>
        <v-col
          v-for="(plan, index) in props.plans"
          :key="index"
          :cols="12"
          :sm="props.columns === 2 ? 6 : 4"
          :md="12 / props.columns"
        >
          <v-card
            :variant="props.style === 'card' ? 'elevated' : 'outlined'"
            :class="[
              'pricing-item',
              { 'highlighted': plan.highlighted }
            ]"
            :color="plan.highlighted ? props.highlightColor : undefined"
            min-height="100%"
          >
            <v-card-item>
              <div class="pricing-header text-center">
                <h3 class="text-h5 mb-2">{{ plan.name }}</h3>
                <div class="pricing-price">
                  <span class="currency">{{ props.currency }}</span>
                  <span class="amount">{{ getPlanPrice(plan) }}</span>
                  <span class="period">/{{ plan.period }}</span>
                </div>
              </div>
            </v-card-item>

            <v-divider />

            <v-card-text>
              <v-list
                :lines="false"
                class="pricing-features"
              >
                <v-list-item
                  v-for="(feature, featureIndex) in plan.features"
                  :key="featureIndex"
                  class="pricing-feature"
                >
                  <template v-slot:prepend>
                    <v-icon
                      icon="mdi-check-circle"
                      color="success"
                      size="small"
                    />
                  </template>
                  {{ feature }}
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-card-actions class="justify-center pa-6">
              <v-btn
                :color="plan.highlighted ? 'primary' : undefined"
                :variant="plan.highlighted ? 'flat' : 'outlined'"
                size="large"
                block
              >
                {{ plan.buttonText }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  highlighted: boolean;
}

interface Props {
  plans: PricingPlan[];
  style: 'card' | 'minimal' | 'table';
  currency: string;
  showAnnual: boolean;
  columns: number;
  backgroundColor: string;
  highlightColor: string;
}

const props = withDefaults(defineProps<Props>(), {
  plans: () => [],
  style: 'card',
  currency: 'R$',
  showAnnual: true,
  columns: 3,
  backgroundColor: '#ffffff',
  highlightColor: '#f5f5f5',
});

const period = ref<'monthly' | 'annual'>('monthly');

const getPlanPrice = (plan: PricingPlan) => {
  const price = Number(plan.price);
  if (period.value === 'annual') {
    return Math.floor(price * 0.8 * 12).toString();
  }
  return plan.price;
};
</script>

<style scoped>
.pricing-block {
  overflow: hidden;
}

.pricing-item {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pricing-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.pricing-item.highlighted {
  position: relative;
  transform: scale(1.05);
}

.pricing-item.highlighted:hover {
  transform: scale(1.05) translateY(-4px);
}

.pricing-header {
  padding: 24px 0;
}

.pricing-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-top: 16px;
}

.currency {
  font-size: 1.5rem;
  font-weight: 500;
  color: #666;
}

.amount {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
}

.period {
  font-size: 1rem;
  color: #666;
}

.pricing-features {
  padding: 24px 0;
}

.pricing-feature {
  padding: 8px 0;
}

:deep(.v-list-item__prepend) {
  margin-right: 12px;
}
</style> 
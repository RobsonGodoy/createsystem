<template>
  <div class="loading-overlay" v-if="show">
    <div class="jarvis-loader">
      <div class="arc-reactor">
        <div class="circle-outer"></div>
        <div class="circle-inner">
          <div class="circle-core"></div>
        </div>
        <div class="circles">
          <div v-for="n in 6" :key="n" class="circle" :style="{ transform: `rotate(${n * 60}deg)` }">
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="loading-text glitch-effect">
      {{ message || 'SISTEMA INICIANDO...' }}
    </div>
    <div class="loading-subtext">
      {{ subMessage || 'Carregando componentes...' }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  message?: string;
  subMessage?: string;
}>();
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--background-dark);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.jarvis-loader {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arc-reactor {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-outer {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--primary-color);
  animation: spin 2s linear infinite;
}

.circle-inner {
  position: absolute;
  width: 80%;
  height: 80%;
  border-radius: 50%;
  border: 2px solid var(--primary-color);
  animation: spin 2s linear infinite reverse;
}

.circle-core {
  position: absolute;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background: var(--primary-color);
  box-shadow: 0 0 20px var(--primary-color);
  animation: pulse 2s ease-in-out infinite;
}

.circles {
  position: absolute;
  width: 100%;
  height: 100%;
  animation: spin 10s linear infinite;
}

.circle {
  position: absolute;
  width: 100%;
  height: 100%;
}

.line {
  position: absolute;
  width: 2px;
  height: 50%;
  background: var(--primary-color);
  left: 50%;
  transform-origin: bottom;
}

.loading-text {
  color: var(--primary-color);
  font-size: 1.5rem;
  margin-top: 2rem;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 2px;
}

.loading-subtext {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-top: 1rem;
  opacity: 0.7;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { opacity: 0.5; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.5; transform: scale(0.9); }
}
</style> 
<template>
  <div class="login-container tech-bg">
    <div class="login-content">
      <div class="login-header tech-text">
        <div class="arc-reactor-small">
          <div class="circle-outer"></div>
          <div class="circle-inner">
            <div class="circle-core"></div>
          </div>
        </div>
        <h1 class="text-h4 mb-6">SISTEMA DE ACESSO</h1>
      </div>

      <v-card class="login-card tech-card hologram" elevation="0">
        <v-card-text>
          <div class="scan-line"></div>
          <form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="email"
              label="E-mail"
              type="email"
              required
              variant="outlined"
              :rules="[rules.required, rules.email]"
              class="mb-4 tech-input"
              prepend-inner-icon="mdi-email"
              :loading="loading"
              :disabled="loading"
            />

            <v-text-field
              v-model="password"
              label="Senha"
              type="password"
              required
              variant="outlined"
              :rules="[rules.required]"
              class="mb-6 tech-input"
              prepend-inner-icon="mdi-lock"
              :loading="loading"
              :disabled="loading"
            />

            <v-btn
              type="submit"
              block
              :loading="loading"
              :disabled="loading"
              class="mb-4 pulse-effect"
              color="primary"
            >
              ACESSAR SISTEMA
            </v-btn>

            <div class="text-center">
              <router-link to="/register" class="tech-link">
                Criar nova conta
              </router-link>
            </div>
          </form>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido'
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/sites')
  } catch (error: any) {
    console.error('Erro ao fazer login:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at center, transparent 0%, var(--background-dark) 70%),
    var(--tech-pattern);
  opacity: 0.1;
  pointer-events: none;
}

.login-content {
  width: 100%;
  max-width: 400px;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.arc-reactor-small {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  position: relative;
}

.circle-outer {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 4s linear infinite;
}

.circle-inner {
  position: absolute;
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 3s linear infinite reverse;
}

.circle-core {
  position: absolute;
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  background: var(--primary-color);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--primary-color);
  animation: pulse 2s ease-in-out infinite;
}

.login-card {
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  opacity: 0.5;
  animation: scanline 2s linear infinite;
}

.tech-input :deep(.v-field) {
  border-color: var(--primary-color) !important;
  background: rgba(0, 168, 255, 0.05) !important;
}

.tech-input :deep(.v-field:hover) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 5px var(--primary-color) !important;
}

.tech-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.tech-link:hover {
  text-shadow: 0 0 5px var(--primary-color);
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(400%); }
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
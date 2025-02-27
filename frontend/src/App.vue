<template>
  <v-app class="tech-bg">
    <v-app-bar v-if="isAuthenticated" color="primary">
      <v-app-bar-title>Site Builder</v-app-bar-title>
      <v-spacer />
      <v-btn variant="text" :to="{ name: 'sites' }">Meus Sites</v-btn>
      <v-btn variant="text" @click="handleLogout">Sair</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <jarvis-loader 
          :show="loading"
          :message="loadingMessage"
          :sub-message="loadingSubMessage"
        />
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          {{ new Date().getFullYear() }} — <strong>Site Builder</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import JarvisLoader from '@/components/JarvisLoader.vue'
import '@/assets/theme.css'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const loading = ref(true)
const loadingMessage = ref('INICIANDO SISTEMA')
const loadingSubMessage = ref('Carregando módulos...')

const startupSequence = async () => {
  const messages = [
    { main: 'INICIANDO J.A.R.V.I.S', sub: 'Carregando módulos principais...' },
    { main: 'VERIFICANDO SISTEMAS', sub: 'Analisando componentes...' },
    { main: 'ESTABELECENDO CONEXÃO', sub: 'Conectando aos servidores...' },
    { main: 'CONFIGURANDO INTERFACE', sub: 'Preparando ambiente...' },
    { main: 'SISTEMA PRONTO', sub: 'Bem-vindo de volta!' }
  ]

  for (const msg of messages) {
    loadingMessage.value = msg.main
    loadingSubMessage.value = msg.sub
    await new Promise(resolve => setTimeout(resolve, 800))
  }

  await new Promise(resolve => setTimeout(resolve, 500))
  loading.value = false
}

onMounted(() => {
  startupSequence()
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilo global para scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background-dark);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}

/* Fonte monospace para elementos de código/tech */
.tech-font {
  font-family: 'Roboto Mono', monospace !important;
}

/* Efeito de borda brilhante */
.glow-border {
  border: 1px solid var(--primary-color);
  box-shadow: 0 0 10px var(--primary-color);
}

/* Efeito de texto tech */
.tech-text {
  color: var(--primary-color);
  text-shadow: 0 0 5px var(--primary-color);
  letter-spacing: 1px;
}
</style>

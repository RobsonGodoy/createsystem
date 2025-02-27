<template>
  <v-app class="tech-bg">
    <v-app-bar v-if="isAuthenticated" class="tech-app-bar" elevation="0">
      <div class="d-flex align-center">
        <v-icon size="32" color="primary" class="mr-3">mdi-web</v-icon>
        <v-app-bar-title class="tech-title">Site Builder</v-app-bar-title>
      </div>
      <v-spacer />
      <v-btn
        variant="text"
        :to="{ name: 'sites' }"
        class="tech-nav-button mr-2"
        prepend-icon="mdi-view-dashboard"
      >
        Meus Sites
      </v-btn>
      <v-btn
        variant="text"
        @click="handleLogout"
        class="tech-nav-button"
        prepend-icon="mdi-logout"
      >
        Sair
      </v-btn>
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

/* Estilos para a barra de navegação futurista */
.tech-app-bar {
  background: linear-gradient(90deg, var(--background-dark) 0%, var(--primary-color-dark) 100%) !important;
  border-bottom: 2px solid var(--primary-color);
  box-shadow: 0 2px 12px rgba(41, 182, 246, 0.2) !important;
  backdrop-filter: blur(10px);
}

.tech-title {
  color: #E1F5FE !important; /* Azul muito claro */
  font-weight: bold;
  text-shadow: 0 0 8px rgba(41, 182, 246, 0.3);
  letter-spacing: 1px;
}

.tech-nav-button {
  position: relative;
  overflow: hidden;
  color: #B3E5FC !important; /* Azul claro */
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  margin: 0 4px;
  padding: 0 16px;
  height: 36px;
  border-radius: 4px;
}

.tech-nav-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, var(--primary-color), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tech-nav-button:hover {
  transform: translateY(-1px);
  color: #E1F5FE !important; /* Azul muito claro ao passar o mouse */
  text-shadow: 0 0 8px rgba(41, 182, 246, 0.4);
  background: rgba(41, 182, 246, 0.1);
}

.tech-nav-button:hover::before {
  opacity: 0.2;
}

.tech-nav-button .v-icon {
  margin-right: 4px;
  transition: transform 0.3s ease;
  color: #B3E5FC !important; /* Azul claro para os ícones */
}

.tech-nav-button:hover .v-icon {
  transform: scale(1.1);
  color: #E1F5FE !important; /* Azul muito claro para os ícones ao passar o mouse */
}

/* Ajustando o ícone principal também */
.tech-app-bar .v-icon.mr-3 {
  color: #E1F5FE !important; /* Azul muito claro para o ícone principal */
  text-shadow: 0 0 8px rgba(41, 182, 246, 0.3);
}
</style>

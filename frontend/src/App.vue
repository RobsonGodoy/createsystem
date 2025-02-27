<template>
  <v-app>
    <v-app-bar v-if="isAuthenticated" color="primary">
      <v-app-bar-title>Site Builder</v-app-bar-title>
      <v-spacer />
      <v-btn variant="text" :to="{ name: 'sites' }">Meus Sites</v-btn>
      <v-btn variant="text" @click="handleLogout">Sair</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <RouterView />
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

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

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
</style>

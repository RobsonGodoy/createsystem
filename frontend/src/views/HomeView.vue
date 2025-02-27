<script setup lang="ts">
// Nenhuma lógica adicional necessária por enquanto
</script>

<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="8">
        <v-card class="mt-4">
          <v-card-title class="text-h4 text-center pa-4">
            Bem-vindo ao Site Builder
          </v-card-title>

          <v-card-text class="text-center">
            <p class="text-body-1 mb-4">
              Aqui você pode criar e gerenciar seus sites de forma fácil e rápida.
            </p>

            <v-row justify="center" class="mt-4">
              <v-col cols="12" sm="6" md="4">
                <v-btn
                  color="primary"
                  block
                  :to="{ name: 'sites' }"
                  prepend-icon="mdi-view-grid"
                >
                  Meus Sites
                </v-btn>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-btn
                  color="success"
                  block
                  :to="{ name: 'editor' }"
                  prepend-icon="mdi-plus"
                >
                  Criar Novo Site
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

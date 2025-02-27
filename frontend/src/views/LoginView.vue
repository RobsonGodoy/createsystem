<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                prepend-icon="mdi-email"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Senha"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="!valid"
              @click="handleSubmit"
            >
              Entrar
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-center">
            <router-link to="/register">Não tem uma conta? Registre-se</router-link>
          </v-card-text>
        </v-card>
        <v-snackbar v-model="showError" color="error" timeout="3000">
          {{ errorMessage }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const valid = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const showError = ref(false);
const errorMessage = ref('');

const email = ref('');
const password = ref('');

const emailRules = [
  (v: string) => !!v || 'E-mail é obrigatório',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
];

const passwordRules = [
  (v: string) => !!v || 'Senha é obrigatória',
  (v: string) => v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres',
];

const handleSubmit = async () => {
  if (!valid.value) return;

  loading.value = true;
  const success = await authStore.login(email.value, password.value);

  if (success) {
    router.push('/');
  } else {
    showError.value = true;
    errorMessage.value = 'E-mail ou senha inválidos';
  }

  loading.value = false;
};
</script> 
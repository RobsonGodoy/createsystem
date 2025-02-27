<template>
  <div class="contact-block" :style="{ padding: '24px' }">
    <v-card class="pa-4">
      <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
        <template v-for="field in props.fields" :key="field">
          <v-text-field
            v-if="field === 'name'"
            v-model="formData.name"
            :rules="nameRules"
            label="Nome"
            required
          />
          <v-text-field
            v-else-if="field === 'email'"
            v-model="formData.email"
            :rules="emailRules"
            label="E-mail"
            type="email"
            required
          />
          <v-textarea
            v-else-if="field === 'message'"
            v-model="formData.message"
            :rules="messageRules"
            label="Mensagem"
            required
            auto-grow
            rows="4"
          />
        </template>

        <v-btn
          :color="props.submitButtonColor"
          :loading="loading"
          :disabled="!valid"
          block
          type="submit"
          class="mt-4"
        >
          {{ props.submitText }}
        </v-btn>
      </v-form>

      <v-snackbar
        v-model="showSuccess"
        color="success"
        timeout="3000"
      >
        {{ props.successMessage }}
      </v-snackbar>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface Props {
  fields: string[];
  submitText: string;
  submitButtonColor: string;
  successMessage: string;
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => ['name', 'email', 'message'],
  submitText: 'Enviar',
  submitButtonColor: 'primary',
  successMessage: 'Mensagem enviada com sucesso!',
});

const valid = ref(false);
const loading = ref(false);
const showSuccess = ref(false);

const formData = reactive({
  name: '',
  email: '',
  message: '',
});

const nameRules = [
  (v: string) => !!v || 'Nome é obrigatório',
  (v: string) => v.length >= 3 || 'Nome deve ter no mínimo 3 caracteres',
];

const emailRules = [
  (v: string) => !!v || 'E-mail é obrigatório',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
];

const messageRules = [
  (v: string) => !!v || 'Mensagem é obrigatória',
  (v: string) => v.length >= 10 || 'Mensagem deve ter no mínimo 10 caracteres',
];

const handleSubmit = async () => {
  loading.value = true;

  try {
    // TODO: Implementar envio do formulário
    await new Promise(resolve => setTimeout(resolve, 1000));
    showSuccess.value = true;
    formData.name = '';
    formData.email = '';
    formData.message = '';
    valid.value = false;
  } finally {
    loading.value = false;
  }
};
</script> 
<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const formData = ref({ password: '', repassword: '' });
const isSubmitting = ref(false);

const updatePassword = async () => {
  isSubmitting.value = true;
  await userStore.updatePassword({ ...formData.value });
  isSubmitting.value = false;
};

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

const showNotification = (message, color) => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};
</script>

<template>
  <v-card class="mt-5">
    <v-card-title>Change Password</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="updatePassword">
        <v-text-field
          v-model="formData.password"
          label="New Password"
          type="password"
        ></v-text-field>
        <v-text-field
          v-model="formData.repassword"
          label="Confirm New Password"
          type="password"
        ></v-text-field>
        <v-btn :loading="isSubmitting" @click="updatePassword" class="mt-3">
          Change Password
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

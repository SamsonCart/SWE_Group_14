<script setup>
// Importing user store to manage user-related state and actions
import { useUserStore } from '@/store/user';

// Initialize user store
const userStore = useUserStore();

// Reactive reference to form data, containing password and repassword fields
const formData = ref({ password: '', repassword: '' });

// Reactive reference to track if form submission is in progress
const isSubmitting = ref(false);

// Function to update the password
const updatePassword = async () => {
  // Set isSubmitting to true to indicate form submission is in progress
  isSubmitting.value = true;

  // Call the updatePassword method from user store with formData
  await userStore.updatePassword({ ...formData.value });

  // Set isSubmitting to false to indicate form submission is completed
  isSubmitting.value = false;
};

// Reactive references for snackbar state, message, and color
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

// Function to show notification with a message and color
const showNotification = (message, color) => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true; // Show snackbar
};
</script>

<template>
  <!-- Card container for the change password form -->
  <v-card class="mt-5">
    <!-- Card title -->
    <v-card-title>Change Password</v-card-title>
    <!-- Card text containing the form -->
    <v-card-text>
      <!-- Form to change password, preventing default submit action -->
      <v-form @submit.prevent="updatePassword">
        <!-- Password input field -->
        <v-text-field
          v-model="formData.password"
          label="New Password"
          type="password"
        ></v-text-field>
        <!-- Confirm password input field -->
        <v-text-field
          v-model="formData.repassword"
          label="Confirm New Password"
          type="password"
        ></v-text-field>
        <!-- Submit button with loading state -->
        <v-btn :loading="isSubmitting" @click="updatePassword" class="mt-3">
          Change Password
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>

  <!-- Snackbar for notifications -->
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

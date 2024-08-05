<script setup>
// Import necessary modules and utilities
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import { useMessageStore } from '@/store/message';
import { regexEmail } from '@/utils/regex';

// Initialize stores
const userStore = useUserStore();
const messageStore = useMessageStore();

// Define reactive variables for the component's state
const visibleEye = ref(true);
const isSubmitting = ref(false);
const formData = ref({ email: 'customer@example.com', password: 'password' });
const formErrors = ref({ email: '', password: '' });
const formTouched = ref(false); // To track if form has been submitted

// Function to handle login
const login = async () => {
  formTouched.value = true;
  isSubmitting.value = true;

  // Validate form data
  let valid = true;
  for (const [key, value] of Object.entries(formData.value)) {
    let error = '';

    if (!value) {
      error = `${key} is a mandatory field!`;
      valid = false;
    } else if (key === 'email' && !regexEmail(value)) {
      error = 'You must enter a valid email address';
      valid = false;
    }

    formErrors.value[key] = error;
  }

  if (!valid) {
    isSubmitting.value = false;
    return;
  }

  try {
    // Attempt login
    await userStore.login({ ...formData.value });
  } catch (error) {
    messageStore.setError({ error });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <v-container>
    <utils-get-error-success />
    <v-card>
      <v-card-title>Sign In</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="formData.email"
            label="Email"
            type="email"
            autocomplete="off"
            outlined
            dense
            :error-messages="formTouched && formErrors.email"
          />
          <v-text-field
            v-model="formData.password"
            :type="visibleEye ? 'password' : 'text'"
            label="Password"
            outlined
            dense
            append-icon="mdi-eye"
            @click:append="visibleEye = !visibleEye"
            :error-messages="formTouched && formErrors.password"
          />
          <v-checkbox label="Remember me" />
          <v-btn
            @click="login"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            color="primary"
            block
          >
            Sign In
          </v-btn>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions class="justify-center">
        <span>New on our platform?</span>
        <v-btn text to="/signup">Create an account</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
/* Add any custom styles here */
</style>

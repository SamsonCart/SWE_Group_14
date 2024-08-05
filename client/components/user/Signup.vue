<script setup>
// Import necessary modules and utilities
import { useUserStore } from '@/store/user';
import { useMessageStore } from '@/store/message';
import { regexEmail } from '@/utils/regex';
import { useRouter } from 'vue-router';

// Initialize stores
const userStore = useUserStore();
const messageStore = useMessageStore();
const router = useRouter();

// Define reactive variables for the component's state
const isSubmitting = ref(false);
const initialFormData = {
  email: 'customer@example.com',
  username: 'customer',
  password: 'password',
  repassword: 'password'
};
const formData = ref({ ...initialFormData });
const formErrors = ref({
  email: '',
  username: '',
  password: '',
  repassword: ''
});
const formTouched = ref(false); // To track if form has been submitted

// Function to handle signup
const signup = async () => {
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
    } else if (key === 'repassword' && value !== formData.value.password) {
      error = 'Passwords do not match';
      valid = false;
    }

    formErrors.value[key] = error;
  }

  if (!valid) {
    isSubmitting.value = false;
    return;
  }

  try {
    // Attempt signup
    await userStore.signup({ ...formData.value });
    formData.value = { ...initialFormData }; // Reset form
    router.push('/signin');
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
      <v-card-title>Sign Up</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="signup">
          <v-text-field
            v-model="formData.username"
            label="Username"
            autocomplete="off"
            outlined
            dense
            :error-messages="formTouched && formErrors.username"
          />
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
            type="password"
            label="Password"
            outlined
            dense
            :error-messages="formTouched && formErrors.password"
          />
          <v-text-field
            v-model="formData.repassword"
            type="password"
            label="Re-Password"
            outlined
            dense
            :error-messages="formTouched && formErrors.repassword"
          />
          <v-btn
            @click="signup"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            color="primary"
            block
          >
            Sign Up
          </v-btn>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions class="justify-center">
        <span>Already have an account?</span>
        <v-btn text to="/signin">Sign in instead</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
/* Add any custom styles here */
</style>

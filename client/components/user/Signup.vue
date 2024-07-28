<script setup>
// Import necessary modules and utilities
import { useUserStore } from '@/store/user';
import { useMessageStore } from '@/store/message';
import { regexEmail } from '@/utils/regex';

// Define props to emit events
const emit = defineEmits(['updateComponent']);

// Initialize stores
const userStore = useUserStore();
const { signup: signupAction } = userStore;
const messageStore = useMessageStore();

// Define reactive variables for the component's state
const isSubmitting = ref(false);
const initialFormData = {
  email: 'business@example.com',
  username: 'customer',
  password: 'password',
  repassword: 'password'
};
const formData = ref({ ...initialFormData });

// Function to handle signup
const signup = () => {
  isSubmitting.value = true;

  // Validate form data
  for (const [key, value] of Object.entries(formData.value)) {
    let error;

    if (!value) {
      error = `${key} is a mandatory field!`;
    } else if (key === 'email' && !regexEmail(value)) {
      error = 'You must enter a valid email address';
    }

    if (error) {
      messageStore.setError({ error });

      setTimeout(() => {
        isSubmitting.value = false;
      }, 2000); // Prevent serial clicks

      return;
    }
  }

  // Attempt signup
  userStore.signup({ ...formData.value }).then((res) => {
    if (res) {
      formData.value = { ...initialFormData }; // Reset form
    }
  });

  setTimeout(() => {
    isSubmitting.value = false;
  }, 2000); // Prevent serial clicks
};
</script>

<template>
  <!-- Display error or success messages -->
  <utilsGetErrorSuccess />

  <div id="signinup" class="card">
    <div class="card-body">
      <!-- Username Input Field -->
      <div class="form-group row mb-2">
        <label for="username" class="col-sm-4 col-form-label">Username</label>
        <div class="col-sm-8">
          <input
            type="text"
            autocomplete="false"
            class="form-control"
            id="username"
            placeholder="Username"
            v-model="formData.username"
          />
        </div>
      </div>

      <!-- Email Input Field -->
      <div class="form-group row mb-2">
        <label for="email" class="col-sm-4 col-form-label">Email</label>
        <div class="col-sm-8">
          <input
            type="email"
            autocomplete="false"
            class="form-control"
            id="email"
            placeholder="Email"
            v-model="formData.email"
          />
        </div>
      </div>

      <!-- Password Input Field -->
      <div class="form-group row mb-2">
        <label for="password" class="col-sm-4 col-form-label">Password</label>
        <div class="col-sm-8">
          <div id="passwordColumn">
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Password"
              v-model="formData.password"
            />
          </div>
        </div>
      </div>

      <!-- Re-Password Input Field -->
      <div class="form-group row mb-2">
        <label for="repassword" class="col-sm-4 col-form-label"
          >Re-Password</label
        >
        <div class="col-sm-8">
          <div id="passwordColumn">
            <input
              type="password"
              class="form-control"
              id="repassword"
              placeholder="Re-Password"
              v-model="formData.repassword"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="form-group row">
        <div class="col-sm-12 d-flex justify-content-end">
          <button
            @click="signup()"
            :disabled="isSubmitting"
            class="btn btn-primary"
          >
            Sign Up
          </button>
        </div>
      </div>
      <hr />
      <!-- Link to Signin Page -->
      <div class="text-center">
        Already have an account?
        <router-link class="row-pointer" to="/signin"
          >Sign in instead</router-link
        >
      </div>
    </div>
  </div>
</template>

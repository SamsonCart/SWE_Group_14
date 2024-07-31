<script setup>
// Importing necessary modules and functions from Vue and the user store
import { useUserStore, useNotificationStore } from '@/store';

// Initialize user store and notification store
const userStore = useUserStore();
const notificationStore = useNotificationStore();

// Computed property to get the current user from the user store
const user = computed(() => userStore.getUser);

// Extracting address from user or initializing it to an empty object if not present
const address = user.value.address || {};

// Reactive reference to form data, prefilled with user details
const formData = ref({
  username: user.value.username,
  email: user.value.email,
  firstname: user.value.firstname || '',
  lastname: user.value.lastname || '',
  phonenumber: user.value.phonenumber || '',
  street: address.street || '',
  city: address.city || '',
  state: address.state || '',
  zipCode: address.zipCode || ''
});

// Reactive reference to track if form submission is in progress
const isSubmitting = ref(false);

// Function to get coordinates using OpenStreetMap's Nominatim API
const getCoordinates = async (address) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?street=${address.street}&city=${address.city}&state=${address.state}&format=json`
  );
  const data = await response.json();
  if (data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon)
    };
  }
  return null;
};

// Function to update the user profile
const updateProfile = async () => {
  // Set isSubmitting to true to indicate form submission is in progress
  isSubmitting.value = true;

  // Get coordinates for the provided address
  const coordinates = await getCoordinates({
    street: formData.value.street,
    city: formData.value.city,
    state: formData.value.state
  });

  // Show error notification and stop if coordinates could not be found
  if (!coordinates) {
    notificationStore.showError(
      'Unable to find coordinates for the provided address.'
    );
    isSubmitting.value = false;
    return;
  }

  // Call the updateProfile method from the user store with updated data
  await userStore.updateProfile({
    username: formData.value.username,
    email: formData.value.email,
    roles: toRaw(userStore.user.roles), // Extracting roles as raw data
    firstname: formData.value.firstname,
    lastname: formData.value.lastname,
    phonenumber: formData.value.phonenumber,
    address: {
      state: formData.value.state,
      city: formData.value.city,
      street: formData.value.street,
      zipCode: formData.value.zipCode,
      coordinates
    }
  });

  // Set isSubmitting to false to indicate form submission is completed
  isSubmitting.value = false;
};
</script>

<template>
  <!-- Card container for the update profile form -->
  <v-card class="mt-5">
    <!-- Card title -->
    <v-card-title>Update Profile</v-card-title>
    <!-- Card text containing the form -->
    <v-card-text>
      <!-- Form to update profile, preventing default submit action -->
      <v-form @submit.prevent="updateProfile">
        <!-- Username input field -->
        <v-text-field
          v-model="formData.username"
          label="Username"
        ></v-text-field>
        <!-- Email input field -->
        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
        ></v-text-field>
        <!-- Firstname input field -->
        <v-text-field
          v-model="formData.firstname"
          label="Firstname"
        ></v-text-field>
        <!-- Lastname input field -->
        <v-text-field
          v-model="formData.lastname"
          label="Lastname"
        ></v-text-field>
        <!-- Phone number input field -->
        <v-text-field
          v-model="formData.phonenumber"
          label="Phone number"
        ></v-text-field>
        <!-- Street input field -->
        <v-text-field v-model="formData.street" label="Street"></v-text-field>
        <!-- City input field -->
        <v-text-field v-model="formData.city" label="City"></v-text-field>
        <!-- State input field -->
        <v-text-field v-model="formData.state" label="State"></v-text-field>
        <!-- Zip Code input field -->
        <v-text-field
          v-model="formData.zipCode"
          label="Zip Code"
        ></v-text-field>
        <!-- Submit button with loading state -->
        <v-btn :loading="isSubmitting" @click="updateProfile" class="mt-3">
          Update Profile
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

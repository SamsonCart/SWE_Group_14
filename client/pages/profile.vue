<script setup>
definePageMeta({
  // Define middleware for this page to require authentication
  middleware: 'auth'
});

// Import necessary modules and components
import { useUserStore } from '@/store/user'; // Import the user store for accessing user data
import ProfileInfo from '@/components/user/ProfileInfo.vue'; // Import component for displaying profile info
import ChangePassword from '@/components/user/ChangePassword.vue'; // Import component for changing password
import ProfileUpdate from '@/components/user/ProfileUpdate.vue'; // Import component for updating profile

// Create a reference to the user store
const userStore = useUserStore();

// Define a computed property to get the current user from the user store
const user = computed(() => userStore.getUser);
</script>

<template>
  <v-container class="mt-5">
    <!-- Component for displaying user profile information -->
    <ProfileInfo :user="user" />

    <!-- Component for updating user profile details -->
    <ProfileUpdate />

    <!-- Component for changing user password -->
    <ChangePassword />
  </v-container>
</template>

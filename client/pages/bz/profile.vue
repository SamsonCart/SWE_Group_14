<script setup>
definePageMeta({
  layout: 'dashboard' // Defining the layout of the page as 'dashboard'
});

import { useUserStore } from '@/store/user'; // Importing the user store to manage user-related state and actions
import ProfileInfo from '@/components/user/ProfileInfo.vue'; // Importing the ProfileInfo component to display profile information
import ChangePassword from '@/components/user/ChangePassword.vue'; // Importing the ChangePassword component to handle password changes
import ProfileUpdate from '@/components/user/ProfileUpdate.vue'; // Importing the ProfileUpdate component to handle profile updates

const userStore = useUserStore(); // Initializing the user store
const user = computed(() => userStore.getUser); // Creating a computed property to get the current user data from the store
</script>

<template>
  <v-container class="mt-5">
    <ProfileInfo :user="user" />
    <!-- Rendering the ProfileInfo component and passing the user data as a prop -->
    <ProfileUpdate />
    <!-- Rendering the ProfileUpdate component for updating user profile information -->
    <ChangePassword />
    <!-- Rendering the ChangePassword component for changing the user's password -->
  </v-container>
</template>

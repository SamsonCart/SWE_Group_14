<script setup>
import { useUserStore } from '@/store/user'; // Importing user store to manage user state
import Logo from './Logo.vue'; // Importing Logo component

// Initialize user store and router
const userStore = useUserStore();
const router = useRouter();

// Computed property to check if user is authenticated
const isAuthenticated = computed(() => !!userStore.getToken);

// Logout function to handle user logout
const logout = async () => {
  try {
    await userStore.logout(); // Logout the user
    router.push('/signin'); // Redirect to sign-in page
  } catch (error) {
    console.error('Error during logout:', error); // Log error if logout fails
  }
};
</script>

<template>
  <!-- App bar at the top of the page -->
  <v-app-bar app>
    <!-- Logo displayed as the toolbar title -->
    <v-toolbar-title><Logo /></v-toolbar-title>
    <!-- Spacer to push elements to the right -->
    <v-spacer></v-spacer>

    <!-- Sign-in and sign-up buttons if user is not authenticated -->
    <v-btn text v-if="!isAuthenticated">
      <nuxt-link to="/signin">Sign in</nuxt-link>
    </v-btn>
    <v-btn text v-if="!isAuthenticated">
      <nuxt-link to="/signup">Sign up</nuxt-link>
    </v-btn>

    <!-- User menu if user is authenticated -->
    <v-menu v-else offset-y>
      <!-- Activator for user menu with username displayed -->
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props">
          Hi, {{ userStore.user.username }}!</v-btn
        >
      </template>
      <!-- Menu items for profile and logout -->
      <v-list>
        <v-list-item :to="{ path: '/bz/profile' }" link>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style scoped lang="scss">
/* Scoped styling for buttons */
.v-btn {
  margin-left: 10px;
}
</style>

<script setup>
import { useUserStore } from '@/store/user';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Logo from './Logo.vue';

// Use the user store to manage user state
const userStore = useUserStore();

// Use the router to handle navigation
const router = useRouter();

// Computed property to check if the user is authenticated
const isAuthenticated = computed(() => !!userStore.getToken);

// Logout function to log out the user and redirect to the sign-in page
const logout = async () => {
  try {
    await userStore.logout();
    router.push('/signin');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
</script>

<template>
  <!-- App Bar Component -->
  <v-app-bar app>
    <!-- Logo Component -->
    <v-toolbar-title><Logo /></v-toolbar-title>
    <v-spacer></v-spacer>

    <!-- Conditional Navigation Links -->
    <!-- Links shown if the user is authenticated -->
    <v-btn text v-if="isAuthenticated" :to="{ path: '/dashboard' }" link
      >Home
    </v-btn>
    <v-btn text v-if="isAuthenticated" :to="{ path: '/business' }" link
      >Businesses</v-btn
    >
    <v-btn text v-if="isAuthenticated" :to="{ path: '/service' }" link
      >Service</v-btn
    >

    <!-- Links shown if the user is not authenticated -->
    <v-btn text v-if="!isAuthenticated" :to="{ path: '/signin' }" link
      >Sign in</v-btn
    >
    <v-btn text v-if="!isAuthenticated" :to="{ path: '/signup' }" link
      >Sign up</v-btn
    >

    <!-- User Menu shown if the user is authenticated -->
    <v-menu v-else offset-y>
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"
          >Hi, {{ userStore.user.username }}!</v-btn
        >
      </template>
      <v-list>
        <v-list-item :to="{ path: '/profile' }" link>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <!-- Conditional Link based on user role -->
        <v-list-item
          v-if="!userStore.isBusiness"
          :to="{ path: '/bookings' }"
          link
        >
          <v-list-item-title>My Booking</v-list-item-title>
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
/* Styles for buttons to add some margin */
.v-btn {
  margin-left: 10px;
}
</style>

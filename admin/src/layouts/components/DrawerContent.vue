<!-- This script setup section imports necessary assets, components, and functions. -->
<script setup>
  // Importing images for the upgrade banner in both dark and light themes
  import upgradeBannerDark from '@/assets/images/pro/upgrade-banner-dark.png'
  import upgradeBannerLight from '@/assets/images/pro/upgrade-banner-light.png'
  
  // Importing the SVG logo
  import logo from '@/assets/logo.svg?raw'
  
  // Importing the router to handle navigation
  import router from '@/router'
  
  // Importing the authentication store for state management
  import { useAuthStore } from '@/store'
  
  // Importing navigation components and theme utility from external libraries
  import { VerticalNavLink, VerticalNavSectionTitle } from '@layouts'  // '@layouts' is a local library for navigation components
  import { useTheme } from 'vuetify'  // Vuetify theme utility, see docs: https://vuetifyjs.com/en/features/theme/

  // Initializing the authentication store
  const authStore = useAuthStore()

  // Logout function to log the user out and navigate to the logout route
  const logout = () => {
    authStore.logout()
    router.push('logout')
  }

  // Accessing the current theme from Vuetify and determining which upgrade banner to show based on the theme
  const vuetifyTheme = useTheme()
  const upgradeBanner = computed(() => {
    return vuetifyTheme.global.name.value === 'light' ? upgradeBannerLight : upgradeBannerDark
  })
</script>

<template>
  <!-- 👉 Navigation header section -->
  <div class="nav-header">
    <!-- RouterLink component to navigate to the home page -->
    <RouterLink
      to="/"
      class="app-logo d-flex align-center gap-x-3 app-title-wrapper"
    >
      <!-- Displaying the logo using v-html directive -->
      <div v-html="logo" />
      
      <!-- Transition effect for the app title -->
      <Transition name="vertical-nav-app-title">
        <h1 class="font-weight-semibold leading-normal text-xl text-uppercase">PushPin</h1>
      </Transition>
    </RouterLink>
  </div>

  <!-- 👉 Navigation items section -->
  <ul>
    <!-- Dashboard link -->
    <VerticalNavLink
      :item="{
        title: 'Dashboard',
        to: 'dashboard',
        icon: { icon: 'mdi-home-outline' },  // Material Design Icon, see docs: https://materialdesignicons.com/
      }"
    />

    <!-- Users link, visible only to admins -->
    <VerticalNavLink
      v-if="authStore.isAdmin() === true"
      :item="{
        to: 'users',
        title: 'Users',
        icon: { icon: 'mdi-account-group' },  // Material Design Icon
      }"
    />

    <!-- 👉 User section title -->
    <VerticalNavSectionTitle :item="{ heading: 'User' }" />

    <!-- Logout link -->
    <VerticalNavLink
      :item="{
        to: 'login',
        title: 'Logout',
        icon: { icon: 'mdi-login' },  // Material Design Icon
      }"
      @click="logout"
    />
  </ul>
</template>

<style lang="scss">
/* Styling for the upgrade banner */
.upgrade-banner {
  margin-top: auto;
}
</style>

<script setup>
import Header from '@/components/general/Header';
import { useNotificationStore } from '@/store/notificationStore';

const notificationStore = useNotificationStore();
</script>
<template>
  <v-app>
    <Header />
    <v-navigation-drawer app>
      <v-list>
        <v-list-item to="/business/dashboard" link> Dashboard </v-list-item>
        <v-list-item to="/business/services" link> Services </v-list-item>
        <!-- <v-list-item link>
          <nuxt-link to="/bookings"> Bookings </nuxt-link>
        </v-list-item>
        <v-list-item link>
          <nuxt-link to="/reviews"> Reviews </nuxt-link>
        </v-list-item>
        <v-list-item link>
          <nuxt-link to="/inquiries"> Inquiries </nuxt-link>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>
    <v-main class="w-100">
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
    <v-snackbar
      v-model="notificationStore.snackbar.show"
      :color="notificationStore.snackbar.color"
      top
    >
      {{ notificationStore.snackbar.message }}
      <template #actions>
        <v-btn color="white" text @click="notificationStore.closeSnackbar"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
  </v-app>
</template>
<style scoped></style>

<script setup>
import { useNotificationStore } from '@/store/notification';
import DashHeader from '@/components/general/DashHeader.vue';

const notificationStore = useNotificationStore();
</script>
<template>
  <v-app>
    <DashHeader />
    <v-navigation-drawer app>
      <v-list>
        <v-list-item to="/bz/dashboard" link> Dashboard </v-list-item>
        <v-list-item to="/bz/services" link> Services </v-list-item>
        <v-list-item to="/bz/bookings" link> Bookings </v-list-item>
        <v-list-item to="/bz/reviews" link> Reviews </v-list-item>
        <v-list-item to="/bz/inquiries" link> Inquiries </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="w-100">
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
    <v-snackbar
      class="text-lg"
      v-model="notificationStore.snackbar.show"
      :color="notificationStore.snackbar.color"
      location="top right"
    >
      {{ notificationStore.snackbar.message }}
      <template #actions>
        <v-icon @click="notificationStore.closeSnackbar" class="mr-2"
          >mdi-close</v-icon
        >
      </template>
    </v-snackbar>
  </v-app>
</template>
<style scoped></style>

<script setup>
import Header from '@/components/general/Header';
import { useNotificationStore } from '@/store/notificationStore';

const notificationStore = useNotificationStore();
</script>

<template>
  <v-app>
    <Header />
    <v-main>
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

<script setup>
// Layout for customer
import { useNotificationStore } from '@/store/notification';
import Header from '@/components/general/Header.vue';

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

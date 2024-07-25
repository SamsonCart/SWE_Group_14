<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const user = computed(() => userStore.getUser);
</script>

<template>
  <v-card class="mt-5">
    <v-card-title>User Information</v-card-title>
    <v-card-text>
      <div class="form-group row mb-2">
        <label for="email" class="col-sm-4 text-end">Email:</label>
        <div class="col-sm-8">
          {{ user.email }}
        </div>
      </div>
      <div class="form-group row mb-2">
        <label for="username" class="col-sm-4 text-end">Username:</label>
        <div class="col-sm-8">
          {{ user.username }}
        </div>
      </div>
      <div class="form-group row mb-4 mt-3">
        <label for="isActive" class="col-sm-4 text-end">Active:</label>
        <div class="col-sm-8">
          <v-chip
            :color="user.isActive ? 'success' : 'error'"
            class="white--text"
          >
            {{ user.isActive ? 'Yes' : 'No' }}
          </v-chip>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

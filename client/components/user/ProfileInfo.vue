<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const user = computed(() => userStore.getUser);
const address = computed(() => user.value.address || {});
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
      <div v-if="address.street" class="form-group row mb-2">
        <label for="street" class="col-sm-4 text-end">Street:</label>
        <div class="col-sm-8">
          {{ address.street }}
        </div>
      </div>
      <div v-if="address.city" class="form-group row mb-2">
        <label for="city" class="col-sm-4 text-end">City:</label>
        <div class="col-sm-8">
          {{ address.city }}
        </div>
      </div>
      <div v-if="address.state" class="form-group row mb-2">
        <label for="state" class="col-sm-4 text-end">State:</label>
        <div class="col-sm-8">
          {{ address.state }}
        </div>
      </div>
      <div v-if="address.zipCode" class="form-group row mb-2">
        <label for="zipCode" class="col-sm-4 text-end">Zip Code:</label>
        <div class="col-sm-8">
          {{ address.zipCode }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const user = computed(() => userStore.getUser);

const formData = ref({
  username: user.value.username,
  email: user.value.email
});

const isSubmitting = ref(false);

const updateProfile = async () => {
  isSubmitting.value = true;
  await userStore.updateProfile({ ...formData.value });
  isSubmitting.value = false;
};
</script>

<template>
  <v-card class="mt-5">
    <v-card-title>Update Profile</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="updateProfile">
        <v-text-field
          v-model="formData.username"
          label="Username"
        ></v-text-field>
        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
        ></v-text-field>
        <v-btn :loading="isSubmitting" @click="updateProfile" class="mt-3">
          Update Profile
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

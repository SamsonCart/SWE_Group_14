<script setup>
definePageMeta({
  layout: 'user',
  middleware: 'auth'
});

import { useUserStore } from '@/store/user';
import ProfileInfo from '@/components/user/ProfileInfo.vue';
import ChangePassword from '@/components/user/ChangePassword.vue';
import ProfileUpdate from '@/components/user/ProfileUpdate.vue';

const userStore = useUserStore();
const user = computed(() => userStore.getUser);
</script>

<template>
  <v-container class="mt-5">
    <ProfileInfo :user="user" />
    <ProfileUpdate />
    <ChangePassword />
  </v-container>
</template>

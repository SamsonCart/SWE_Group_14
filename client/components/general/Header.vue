<script setup>
import { useUserStore } from '@/store/user';
import { computed } from 'vue';

const userStore = useUserStore();
const router = useRouter();

const isAuthenticated = computed(() => !!userStore.getToken);

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
  <v-app-bar app>
    <v-toolbar-title>Booking</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn text v-if="!isAuthenticated">
      <nuxt-link to="/signin">Sign in</nuxt-link>
    </v-btn>
    <v-btn text v-if="!isAuthenticated">
      <nuxt-link to="/signup">Sign up</nuxt-link>
    </v-btn>

    <template v-else>
      <v-btn text disabled> Hi, {{ userStore.user.username }}! </v-btn>
      <v-btn text @click="logout">Logout</v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped lang="scss">
.v-btn {
  margin-left: 10px;
}
</style>

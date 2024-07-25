<script setup>
import { useUserStore } from '@/store/user';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

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

    <v-menu v-else offset-y>
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on">
          Hi, {{ userStore.user.username }}!
        </v-btn>
      </template> -->
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props">
          Hi, {{ userStore.user.username }}!</v-btn
        >
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            <nuxt-link to="/profile">Profile</nuxt-link>
          </v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style scoped lang="scss">
.v-btn {
  margin-left: 10px;
}
</style>

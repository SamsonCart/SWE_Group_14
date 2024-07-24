<script setup>
import { useUserStore } from '~/store/user';
import TopItems from '@/components/user/TopItems';

const userStore = useUserStore();
const router = useRouter();

const logout = async () => {
  await userStore.logout();
  router.push('/signin');
};
</script>

<template>
  <header>
    <nav>
      <div class="logo">Booking</div>
      <ul class="nav-links" v-if="!userStore.getToken">
        <li><router-link to="/signin">Sign in</router-link></li>
        <li><router-link to="/signup">Sign up</router-link></li>
      </ul>
      <!-- <TopItems /> -->
      <ul class="nav-links" v-if="userStore.getToken">
        <li>Hi, {{ userStore.user.username }}!</li>
        <li style="cursor: pointer" @click="logout">Logout</li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
header {
  background-color: #f4f4f4;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
}

.nav-links li {
  margin-left: 1rem;
}

.nav-links a {
  text-decoration: none;
  color: #333;
}
</style>

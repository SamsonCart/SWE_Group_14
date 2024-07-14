<script setup>
import { storeToRefs } from 'pinia';
import { useHomepageStore } from '~/store/homepage';
import { useUserStore } from '~/store/user';
const homepageStore = useHomepageStore();
const userStore = useUserStore();

const initialLoginOrUser = { to: '/login', text: 'Login', icon: 'fa-solid fa-users' };
const loginOrUser = computed(() =>
  userStore.getToken
    ? { text: useUserStore().getUser?.username, to: '/user', icon: 'fa-solid fa-user' }
    : { ...initialLoginOrUser }
);

const getHeaderItems = computed(() => [...homepageStore.getHeaderItems, loginOrUser.value]);
</script>

<template>
  <!-- <header>
    <template v-for="(item, index) in getHeaderItems" :key="index">
      <router-link v-if="item?.to" :to="item.to">
        <span><Icon :icon="item.icon" class="mr-2" /></span>
        {{ item.text }}
      </router-link>
    </template>
  </header> -->
  <header>
     <nav>
       <div class="logo">PushPin</div>
       <ul class="nav-links">
         <li><router-link to="/signin">Sign in</router-link></li>
         <li><router-link to="/signup">Sign up</router-link></li>
       </ul>
     </nav>
   </header>
</template>

<style scoped lang="scss">
// header {
//   width: 90%;
//   border-radius: 0.5rem;
//   padding: 1rem;
//   margin: 0 auto;
//   margin-bottom: 1rem;
//   justify-content: center;
//   display: flex;

//   a {
//     font-family: 'Concert One', cursive;
//     background-color: white;
//     margin: 0 0.5rem;
//     padding: 0.5rem 1rem;
//     border-radius: 0.5rem;
//     color: hsla(160, 100%, 37%, 1);

//     &:hover {
//       background-color: hsla(160, 100%, 37%, 1);
//       color: white;
//       text-decoration: none;
//     }
//   }

//   .router-link-active,
//   .router-link-exact-active {
//     background-color: hsla(160, 100%, 37%, 1);
//     color: white;
//   }
// }
header {
    background-color: #f4f4f4;
    padding: 1rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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

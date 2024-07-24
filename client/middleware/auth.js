import { useUserStore } from '@/store';

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  if (!userStore.getToken) {
    return navigateTo('/signin');
  }
});

import { useUserStore } from '@/store'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const userStore = useUserStore()
    if (!userStore.getToken) {
      return navigateTo('/signin')
    }
  }
})

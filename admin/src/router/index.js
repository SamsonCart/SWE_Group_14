import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { useAuthStore } from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...setupLayouts(routes)],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to, from) => {
  const authStore = await useAuthStore()
  let isAdmin = false

  if (!(to.name === 'login' || to.name === 'register')) {
    isAdmin = authStore.isAdmin() === true
  }

  console.log('router => isAdmin', isAdmin)
  if (
    // make sure the user is authenticated ❗️ Avoid an infinite redirect
    !isAdmin &&
    !(to.name === 'login' || to.name === 'register')
  ) {
    // redirect the user to the login page
    return { name: 'login' }
  } else if (isAdmin && (to.name === 'login' || to.name === 'register')) {
    return { name: 'index' }
  }
})

export default router

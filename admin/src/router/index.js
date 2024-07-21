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
  let isStuff = false

  if (!(to.name === 'login' || to.name === 'register')) {
    isStuff = authStore.isAdmin() || authStore.isBusiness()
  }

  console.log('isStuff => ', isStuff)
  if (
    // make sure the user is authenticated ❗️ Avoid an infinite redirect
    !isStuff &&
    !(to.name === 'login' || to.name === 'register')
  ) {
    // redirect the user to the login page
    return { name: 'login' }
  } else if (isStuff && (to.name === 'login' || to.name === 'register')) {
    return { name: 'index' }
  }
})

export default router

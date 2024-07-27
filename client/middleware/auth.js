import { useUserStore } from '@/store';

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const token = userStore.getToken;

  // Public routes accessible by anonymous users
  const publicRoutes = ['/', '/signin', '/signup'];

  // Routes that require business user access
  const businessRoutes = to.path.startsWith('/bz');

  // Routes that require user access
  const userRoutes = to.path.startsWith('/dashboard');

  // Anonymous users should only access public routes
  if (!token && !publicRoutes.includes(to.path)) {
    return navigateTo('/signin');
  }

  // Redirect authenticated users from auth pages to their respective dashboard
  if (token && publicRoutes.includes(to.path)) {
    if (userStore.isBusiness) {
      return navigateTo('/bz/dashboard');
    } else {
      return navigateTo('/dashboard');
    }
  }

  // Business user access control
  if (businessRoutes && !userStore.isBusiness) {
    return navigateTo('/dashboard');
  }

  // User access control (only logged-in users can access user routes)
  if (userRoutes && !token) {
    return navigateTo('/signin');
  }
});

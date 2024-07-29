import { useUserStore } from '@/store';

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('defineNuxtRouteMiddleware :>> to.path', to.path);
  const userStore = useUserStore();
  const token = userStore.getToken;

  // Public routes accessible by anonymous users
  const publicRoutes = ['/', '/signin', '/signup'];

  // Routes that require business user access
  const businessRoutes = to.path.startsWith('/bz');

  // Routes that require user access
  const userRoutes = to.path.startsWith('/dashboard');

  // Function to check token validity
  const validateToken = async () => {
    try {
      const { data } = await userStore.validateToken(token);
      if (data) {
        userStore.setUser(data, token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // Perform silent JWT check if no token and accessing a protected route
  if (!token && !publicRoutes.includes(to.path)) {
    const isTokenValid = await validateToken();
    if (!isTokenValid) {
      return navigateTo('/signin');
    }
  }

  // Redirect authenticated users from root or auth pages to their respective dashboard
  if (token && (to.path === '/' || to.path === '/signin')) {
    if (userStore.isBusiness) {
      return navigateTo('/bz/dashboard');
    } else {
      return navigateTo('/dashboard');
    }
  }

  // Redirect authenticated users from other public routes to their respective dashboard
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

  // If everything is fine, proceed to the requested page
});

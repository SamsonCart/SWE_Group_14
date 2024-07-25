import { defineStore } from 'pinia';
import { request } from '@/utils/request';
import { useNotificationStore } from '@/store/notificationStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
    isBusiness: false,
    token: ''
  }),
  getters: {
    getUser: (state) => state.user,
    getUserId: (state) => state.user?._id || '',
    getToken: (state) => state.token || ''
  },
  actions: {
    async init() {
      await this.checkLocalToken();
    },
    async checkLocalToken() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await this.validateToken(token);
          if (res) {
            this.setUser(res, token);
          } else {
            this.logout();
          }
        } catch (error) {
          console.error('Error checking local token:', error);
          this.logout();
        }
      }
    },
    async login(payload) {
      const notificationStore = useNotificationStore();
      try {
        const res = await request('post', 'auth/signin', payload);
        if (res) {
          this.setUser(res, res.accessToken);
          this.redirectUser();
          notificationStore.showSuccess('Logged in successfully');
          return true;
        }
      } catch (error) {
        notificationStore.showError('Error logging in');
        console.error('Error logging in:', error);
      }
      return false;
    },
    setUser(user, token) {
      this.user = user;
      this.token = token;
      this.isBusiness =
        user.roles?.some((role) => role.name === 'business') || false;
      localStorage.setItem('user', JSON.stringify(this.user));
      localStorage.setItem('token', this.token);
    },
    redirectUser() {
      const router = useRouter();
      if (this.isBusiness) {
        router.push('/business/dashboard');
      } else {
        router.push('/dashboard');
      }
    },
    async validateToken(token) {
      return await request('post', 'auth/jwtsignin', { token });
    },
    logout() {
      const notificationStore = useNotificationStore();
      this.token = '';
      this.user = {};
      this.isBusiness = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      notificationStore.showSuccess('Logged out successfully');
    },
    async signup(payload) {
      const notificationStore = useNotificationStore();
      try {
        const res = await request('post', 'auth/signup', payload);
        if (res) {
          this.setUser(res, res.accessToken);
          this.redirectUser();
          notificationStore.showSuccess('Signed up successfully');
          return true;
        }
      } catch (error) {
        notificationStore.showError('Error signing up');
        console.error('Error signing up:', error);
      }
      return false;
    },
    async updateProfile(payload) {
      const notificationStore = useNotificationStore();
      try {
        const res = await request('put', 'user/update', payload);
        if (res) {
          this.user = res;
          localStorage.setItem('user', JSON.stringify(this.user));
          notificationStore.showSuccess('Profile updated successfully');
          return true;
        }
      } catch (error) {
        notificationStore.showError('Error updating profile');
        console.error('Error updating profile:', error);
        return false;
      }
    },
    async updatePassword(payload) {
      const notificationStore = useNotificationStore();
      let error = '';
      if (payload.password !== payload.repassword) {
        error = 'Password and Re-password must be the same!';
      } else if (payload.password.length < 5) {
        error = 'Password must be at least 5 characters!';
      }
      if (error) {
        notificationStore.showError(error);
        return false;
      }
      try {
        const res = await request('put', 'user/changepassword', payload);
        if (res) {
          this.token = res;
          localStorage.setItem('token', res);
          notificationStore.showSuccess('Password updated successfully');
          return true;
        }
      } catch (error) {
        notificationStore.showError('Error updating password');
        console.error('Error updating password:', error);
      }
      return false;
    },
    async activate(payload) {
      const notificationStore = useNotificationStore();
      try {
        const res = await request('post', 'auth/activate', payload, 30000);
        if (res) {
          this.redirectUser();
          notificationStore.showSuccess('Account activated successfully');
          return true;
        }
      } catch (error) {
        notificationStore.showError('Error activating account');
        console.error('Error activating account:', error);
      }
      return false;
    }
  }
});

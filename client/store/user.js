import { defineStore } from 'pinia';
import { request } from '@/utils/request';
import { useNotificationStore } from '@/store/notification';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {}, // Stores user information
    isBusiness: false, // Indicates if the user is a business
    token: '' // Stores authentication token
  }),
  getters: {
    getUser: (state) => state.user, // Getter for user information
    getUserId: (state) => state.user?._id || '', // Getter for user ID
    getToken: (state) => state.token || '' // Getter for authentication token
  },
  actions: {
    // Initializes the store by checking local token
    async init() {
      await this.checkLocalToken();
    },
    // Checks if there is a valid token in local storage
    async checkLocalToken() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await this.validateToken(token); // Validates the token
          if (data) {
            this.setUser(data, token); // Sets user and token if valid
            await this.redirectUser(); // Redirects user based on role
          } else {
            this.logout(); // Logs out if token is invalid
          }
        } catch (error) {
          console.error('Error checking local token:', error);
          this.logout(); // Logs out in case of error
        }
      }
    },
    // Logs in the user
    async login(payload) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request('post', 'auth/signin', payload); // Sends login request
        if (!response.isSuccess) throw Error(response.message);
        if (response.data) {
          this.setUser(response.data, response.data.accessToken); // Sets user and token on successful login
          await this.redirectUser(); // Redirects user based on role
          notificationStore.showSuccess('Logged in successfully');
          return true;
        }
      } catch (error) {
        notificationStore.showError(error.message);
        console.error('Error logging in:', error);
      }
      return false;
    },
    // Sets user information and token
    setUser(user, token) {
      this.user = user;
      this.token = token;
      this.isBusiness =
        user.roles?.some((role) => role.name === 'business') || false; // Checks if user is a business
      localStorage.setItem('user', JSON.stringify(this.user)); // Saves user to local storage
      localStorage.setItem('token', this.token); // Saves token to local storage
    },
    // Redirects user based on role
    async redirectUser() {
      const router = useRouter();
      if (this.isBusiness) {
        await router.push('/bz/dashboard'); // Redirects to business dashboard
      } else {
        await router.push('/dashboard'); // Redirects to user dashboard
      }
    },
    // Validates the token
    async validateToken(token) {
      return await request('post', 'auth/jwtsignin', { token });
    },
    // Logs out the user
    logout() {
      const notificationStore = useNotificationStore();
      this.token = '';
      this.user = {};
      this.isBusiness = false;
      localStorage.removeItem('token'); // Removes token from local storage
      localStorage.removeItem('user'); // Removes user from local storage
      notificationStore.showSuccess('Logged out successfully');
    },
    // Signs up a new user
    async signup(payload) {
      const notificationStore = useNotificationStore();
      try {
        const { data } = await request('post', 'auth/signup', payload); // Sends signup request
        if (data) {
          this.setUser(data, data.accessToken); // Sets user and token on successful signup
          this.redirectUser(); // Redirects user based on role
          notificationStore.showSuccess('Signed up successfully');
          return true;
        }
      } catch (error) {
        notificationStore.showError('Error signing up');
        console.error('Error signing up:', error);
      }
      return false;
    },
    // Updates the user's profile
    async updateProfile(payload) {
      const notificationStore = useNotificationStore();
      try {
        console.log('payload :>> ', payload); // Debugging statement
        const { data } = await request('put', 'account/update', payload); // Sends profile update request
        if (data) {
          this.user = data; // Updates user information
          localStorage.setItem('user', JSON.stringify(this.user)); // Updates user in local storage
          notificationStore.showSuccess('Profile updated successfully');
          return true;
        }
      } catch (error) {
        notificationStore.showError('Error updating profile');
        console.error('Error updating profile:', error);
        return false;
      }
    },
    // Updates the user's password
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
        const { data } = await request(
          'put',
          'account/changepassword',
          payload
        ); // Sends password update request
        if (data) {
          this.token = data; // Updates token on successful password change
          localStorage.setItem('token', data); // Updates token in local storage
          notificationStore.showSuccess('Password updated successfully');
          return true;
        }
      } catch (error) {
        notificationStore.showError('Error updating password');
        console.error('Error updating password:', error);
      }
      return false;
    }
  }
});

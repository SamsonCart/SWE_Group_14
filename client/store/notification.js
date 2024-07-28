import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    snackbar: {
      show: false,
      message: '',
      color: 'success'
    }
  }),
  actions: {
    // Adds a success notification
    showSuccess(message) {
      this.snackbar = {
        show: true,
        message,
        color: 'success'
      };
    },
    // Adds an error notification
    showError(message) {
      this.snackbar = {
        show: true,
        message,
        color: 'error'
      };
    },
    closeSnackbar() {
      this.snackbar.show = false;
    }
  }
});

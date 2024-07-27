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
    showSuccess(message) {
      this.snackbar = {
        show: true,
        message,
        color: 'success'
      };
    },
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

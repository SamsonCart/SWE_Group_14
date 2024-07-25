import { useUserStore } from './index';

export const useGlobalStateStore = defineStore('globalState', {
  actions: {
    async init() {
      useUserStore().init();
    }
  }
});

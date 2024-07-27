import { useUserStore } from './index';

export const useGlobalStateStore = defineStore('globalState', {
  actions: {
    async init() {
      await useUserStore().init();
    }
  }
});

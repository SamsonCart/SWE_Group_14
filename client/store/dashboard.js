import { request } from '@/utils/request';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {},
    headerItems: [
      { text: 'Homepage', to: '/', icon: 'fa-solid fa-home' },
      {
        text: 'Categories',
        to: '/post-categories',
        icon: 'fa-solid fa-folder'
      },
      { text: 'Posts', to: '/posts', icon: 'fa-solid fa-mug-hot' }
    ]
  }),
  getters: {
    getHeaderItems: (state) => state.headerItems,
    getStats: (state) => state.stats
  },
  actions: {
    async init() {
      await this.fetchStats();
    },
    async fetchStats() {
      try {
        const res = await request('get', 'dashboard/stats');
        this.setData('stats', res.count);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    },
    async setData(field, payload) {
      this[field] = payload;
    }
  }
});

import { request } from '@/utils'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useHomepageStore = defineStore('homepage', {
  state: () =>
    reactive({
      stats: {}, // The state holds the statistics data
    }),
  getters: {},
  actions: {
    async init() {
      await request('get', 'dashboard/stats').then(res => {
        if (res?.data?.count) {
          this.stats = { ...res.data.count } // Set the stats data if the request is successful
        }
      })
    },
  },
})
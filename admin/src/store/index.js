import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { useHomepageStore } from './homepage'
import { useUserStore } from './user'
import { useAuthStore } from './auth'
import { useMessageStore } from './message'

export { useHomepageStore, useMessageStore, useUserStore, useAuthStore }

export const useMainStore = defineStore('main', {
  state: () => reactive({}),
  getters: {},
  actions: {
    async init() {
      await useHomepageStore().init()
      await useAuthStore().init()
    },
  },
})

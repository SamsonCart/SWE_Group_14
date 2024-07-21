import { request } from '@/utils'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import jwt_decode from 'jwt-decode'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () =>
    reactive({
      user: null,
    }),
  getters: {
    getUser() {
      return this.user
    },
    getAuthUserFullname() {
      return this.user?.username
    },
    getAuthUserRole() {
      return this.user?.roles[0]?.name
    },
  },
  actions: {
    async init() {
      await this.initAuth()
    },
    async initAuth() {
      console.log('initAuth...')
      if (localStorage.getItem('token')) {
        try {
          const res = await request('post', 'auth/jwtsignin')
          if (res?.data) {
            this.setUser(res.data)
            router.replace('/dashboard')
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    setUser(data) {
      this.user = data
    },
    isAdmin() {
      console.log('isAdmin...')
      let isAdmin = false
      if (this.user?.roles) {
        this.user.roles.map(role => {
          if (role.name === 'admin') isAdmin = true
        })
      }
      return isAdmin
    },
    isBusiness() {
      console.log('isBusiness...')
      let isBusiness = false
      if (this.user?.roles) {
        this.user.roles.map(role => {
          if (role.name === 'business') isBusiness = true
        })
      }
      return isBusiness
    },
    logout() {
      this.user = null
      localStorage.removeItem('token')
    },
  },
})

import { request } from '@/utils'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () =>
    reactive({
      user: null, // The state holds the currently authenticated user
    }),
  getters: {
    getUser() {
      return this.user // Getter to retrieve the user
    },
    getAuthUserFullname() {
      return this.user?.username // Getter to retrieve the user's full name
    },
    getAuthUserRole() {
      return this.user?.roles[0]?.name // Getter to retrieve the user's primary role
    },
  },
  actions: {
    async init() {
      await this.initAuth() // Initialize authentication on store initialization
    },
    async initAuth() {
      if (localStorage.getItem('token')) {
        try {
          const res = await request('post', 'auth/jwtsignin') // Authenticate using JWT token
          if (res?.data) {
            this.setUser(res.data) // Set the user data if authentication is successful
            router.replace('/dashboard') // Redirect to the dashboard
          }
        } catch (error) {
          console.log(error) // Log any errors
        }
      }
    },
    setUser(data) {
      this.user = data // Set the user data
    },
    isAdmin() {
      let isAdmin = false
      if (this.user?.roles) {
        this.user.roles.map(role => {
          if (role.name === 'admin') isAdmin = true // Check if the user has an admin role
        })
      }
      return isAdmin // Return true if the user is an admin
    },
    logout() {
      this.user = null // Clear the user data
      localStorage.removeItem('token') // Remove the token from local storage
    },
  },
})

import { request } from '@/utils'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserStore = defineStore('user', {
  state: () =>
    reactive({
      user: {}, // The state holds the current user's data
      users: [], // The state holds a list of users
      pageSize: 10, // Default page size for pagination
      total: 0, // Total number of users
      roles: [], // List of roles
    }),
  getters: {
    getUser() {
      return this.user // Getter to retrieve the current user
    },
    getUsers() {
      return this.users // Getter to retrieve the list of users
    },
    getRoles() {
      return this.roles // Getter to retrieve the list of roles
    },
  },
  actions: {
    init() {
      this.setUsers() // Initialize the user list
      this.setRoles() // Initialize the roles list
    },
    async setUsers(page = 1, itemsPerPage = 10, sortBy = 'username', filter = {}) {
      try {
        console.log('setUsers :>> params', page, itemsPerPage, sortBy, filter)
        const res = await request('get', 'admin/users', { page, limit: itemsPerPage, sortBy, filter })
        if (res?.data) {
          this.users = [...res.data.items] // Set the user list if the request is successful
          this.total = res.data.total // Set the total number of users
        }
      } catch (error) {
        console.error('Failed to set users:', error) // Log any errors
      }
    },
    async setUser(id) {
      try {
        const res = await request('get', 'admin/users/' + id)
        if (res?.data) {
          this.user = { ...res.data } // Set the current user's data if the request is successful
        }
      } catch (error) {
        console.error('Failed to set user:', error) // Log any errors
      }
    },
    async setRoles() {
      try {
        const res = await request('get', 'admin/users/roles')
        if (res?.data) {
          this.roles = [...res.data] // Set the roles list if the request is successful
        }
      } catch (error) {
        console.error('Failed to set roles:', error) // Log any errors
      }
    },
    getRolesByIds(roles) {
      return this.roles.filter(role => roles.includes(role._id)) // Get roles by their IDs
    },
    async createUser(payload) {
      try {
        const res = await request('post', 'admin/users', { ...payload }, 20000)
        this.init() // Re-initialize the user and roles list after creating a user
      } catch (error) {
        console.error('Failed to create user:', error) // Log any errors
      }
    },
    async updateUser(payload) {
      try {
        const res = await request('put', `admin/users/${payload._id}`, { ...payload }, 20000)
        if (res?.data) {
          let found = this.users.find(user => user._id === payload._id)
          if (found) {
            const { username, email, isActive, roles } = res.data
            found.username = username // Update the username
            found.email = email // Update the email
            found.isActive = isActive // Update the active status
            found.roles = roles // Update the roles
          }
        }
      } catch (error) {
        console.error('Failed to update user:', error) // Log any errors
      }
    },
    async removeUser(payload) {
      try {
        const res = await request('delete', `admin/users/${payload._id}`)
        console.log('removeUser :>> ', res)
        if (res?.data) {
          this.users = this.users.filter(user => user._id !== payload?._id) // Remove the user from the list if the request is successful
        }
      } catch (error) {
        console.error('Failed to remove user:', error) // Log any errors
      }
    },
  },
})

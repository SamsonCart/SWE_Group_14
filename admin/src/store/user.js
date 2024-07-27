import { request } from '@/utils'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserStore = defineStore('user', {
  state: () =>
    reactive({
      user: {},
      token: '',
      users: [],
      roles: [],
    }),
  getters: {
    getUser() {
      return this.user
    },
    getUsers() {
      return this.users
    },
    getRoles() {
      return this.roles
    },
  },
  actions: {
    init() {
      this.setUsers()
      this.setRoles()
    },
    async setUsers() {
      try {
        const res = await request('get', 'admin/users')
        if (res?.data) {
          this.users = [...res.data]
        }
      } catch (error) {
        console.error('Failed to set users:', error)
      }
    },
    async setUser(id) {
      try {
        const res = await request('get', 'admin/users/' + id)
        if (res?.data) {
          this.user = { ...res.data }
        }
      } catch (error) {
        console.error('Failed to set user:', error)
      }
    },
    async setRoles() {
      try {
        const res = await request('get', 'admin/users/roles')
        if (res?.data) {
          this.roles = [...res.data]
        }
      } catch (error) {
        console.error('Failed to set roles:', error)
      }
    },
    getRolesByIds(roles) {
      return this.roles.filter(role => roles.includes(role._id))
    },
    async createUser(payload) {
      try {
        const res = await request('post', 'admin/users', { ...payload }, 20000)
        if (res?.data) {
          this.users.push(res.data)
        }
      } catch (error) {
        console.error('Failed to create user:', error)
      }
    },
    async updateUser(payload) {
      try {
        const res = await request('put', `admin/users/${payload._id}`, { ...payload }, 20000)
        if (res?.data) {
          let found = this.users.find(user => user._id === payload._id)
          if (found) {
            const { username, email, isActive, roles } = res.data
            found.username = username
            found.email = email
            found.isActive = isActive
            found.roles = roles
          }
        }
      } catch (error) {
        console.error('Failed to update user:', error)
      }
    },
    async removeUser(payload) {
      try {
        const res = await request('delete', `admin/users/${payload._id}`)
        console.log('removeUser :>> ', res)
        if (res?.data) {
          this.users = this.users.filter(user => user._id !== payload?._id)
        }
      } catch (error) {
        console.error('Failed to remove user:', error)
      }
    },
  },
})

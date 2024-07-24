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
      await request('get', 'admin/users').then(res => {
        if (res?.data) {
          this.users = [...res.data]
        }
      })
    },
    async setUser(id) {
      await request('get', 'admin/users/' + id).then(res => {
        if (res?.data) {
          this.user = { ...res.data }
        }
      })
    },
    async setRoles() {
      await request('get', 'admin/users/roles').then(res => {
        if (res?.data) {
          this.roles = [...res.data]
        }
      })
    },
    getRolesByIds(roles) {
      return this.roles.filter(role => roles.includes(role._id))
    },
    async createUser(payload) {
      await request('post', `admin/users`, { ...payload }, 20000).then(res => {
        if (res?.data) {
          this.users.push(res.data)
        }
      })
    },
    async updateUser(payload) {
      await request('put', `admin/users/${payload._id}`, { ...payload }, 20000).then(res => {
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
      })
    },
    async removeUser(payload) {
      await request('delete', `admin/users/${payload._id}`, { ...payload }).then(res => {
        if (res?.data) {
          this.users = this.users.filter(user => user._id !== payload?._id)
        }
      })
    },
  },
})

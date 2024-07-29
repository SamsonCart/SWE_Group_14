import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: () => ({ error: null, isSuccess: null, errorTime: 5000, successTime: 5000 }), // State for error and success messages with default display times
  getters: {
    getError() {
      return this.error // Getter to retrieve the error message
    },
    getIsSuccess() {
      return this.isSuccess // Getter to retrieve the success message
    },
  },
  actions: {
    setErrorClear(payload) {
      this.error = payload?.error // Set the error message
      let time = payload?.time && payload?.time != undefined ? payload?.time : this.errorTime
      setTimeout(() => {
        this.error = null // Clear the error message after a specified time
      }, time)
    },

    setIsSuccessClear(payload) {
      try {
        this.error = null
        this.isSuccess = payload?.message || null

        const time = payload?.time ? payload.time : this.successTime

        setTimeout(() => {
          this.isSuccess = null // Clear the success message after a specified time
        }, time)
      } catch (error) {
        this.setErrorClear({ error }) // Set an error if there is an exception
      }
    },
    setIsSuccess(payload) {
      try {
        this.error = null
        this.setIsSuccessClear(payload) // Set the success message
      } catch (error) {
        this.setErrorClear({ error }) // Set an error if there is an exception
      }
    },

    setError(payload) {
      try {
        this.isSuccess = null
        this.setErrorClear(payload) // Set the error message
      } catch (error) {
        this.setErrorClear({ error }) // Set an error if there is an exception
      }
    },
  },
})

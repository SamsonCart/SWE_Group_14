<script setup>
/*
 * Importing images and logo assets for the authentication page.
 * Images will be used in the template for styling and logos.
 */
import authV1MaskDark from '@/assets/images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@/assets/images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@/assets/images/pages/auth-v1-tree-2.png'
import authV1Tree from '@/assets/images/pages/auth-v1-tree.png'
import logo from '@/assets/logo.svg?raw'

/*
 * Importing utility function for making HTTP requests.
 * Importing AuthProvider component for authentication methods.
 * Importing Vuetify's useTheme for theme-related functionalities.
 * Importing stores for authentication and messaging.
 */
import { request } from '@/utils'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useTheme } from 'vuetify'
import { useAuthStore, useMessageStore } from '@/store'
import router from '@/router'

// Initializing message and authentication stores
const messageStore = useMessageStore()
const authStore = useAuthStore()

// Reactive reference for form validation status
const valid = ref()

// Validation rules for username and password fields
const rules = {
  username: [v => !!v || 'Username is required'],
  password: [v => !!v || 'Password is required'],
}

// Function to handle login process
const login = async () => {
  // If the form is not valid, display an error message
  if (!valid.value) {
    const error = 'Please fill the form!'
    messageStore.setError({ error })
    return
  }

  // Try to authenticate the user
  try {
    /*
     * Todo: move to authStore
     * Sending a POST request to the 'auth/signin' endpoint with the username, password, and remember fields.
     */
    const res = await request('post', 'auth/signin', {
      username: username.value,
      password: password.value,
      remember: remember.value,
    })

    // If authentication is successful, set the user data and store the token
    if (res?.isSuccess === true) {
      console.log('res.data', res.data)
      authStore.setUser(res.data)
      localStorage.setItem('token', res?.data?.accessToken)
      router.replace('/dashboard')
    }
  } catch (error) {
    // If there is an error, display it using the message store
    messageStore.setError({ error: err.message })
  }
}

// Reactive references for form fields
const username = ref('')
const password = ref('')
const remember = ref('')

// Getting the current theme using Vuetify's useTheme
const vuetifyTheme = useTheme()

// Computed property to determine the authentication theme mask based on the current theme
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

// Reactive reference to toggle password visibility
const isPasswordVisible = ref(false)
</script>

<template>
  <!-- Authentication wrapper with card and form -->
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <!-- Display error message if any -->
      <VAlert
        v-if="messageStore.error"
        border="bottom"
        color="error"
        dark
        class="text-center"
      >
        {{ messageStore.error }}
      </VAlert>

      <!-- Logo and title section -->
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div v-html="logo" />
          </div>
        </template>
        <VCardTitle class="font-weight-semibold text-2xl text-uppercase"> BOOKING </VCardTitle>
      </VCardItem>

      <!-- Sign-in prompt -->
      <VCardText class="pt-2">
        <p class="mb-0">Please sign-in to your account and start the adventure</p>
      </VCardText>

      <!-- Sign-in form -->
      <VCardText>
        <VForm
          v-model="valid"
          lazy-validation
          @submit.prevent="() => {}"
        >
          <VRow>
            <!-- Username field -->
            <VCol cols="12">
              <VTextField
                v-model="username"
                label="Username"
                type="username"
                :counter="55"
                :rules="rules.username"
                required
              />
            </VCol>

            <!-- Password field with toggle visibility -->
            <VCol cols="12">
              <VTextField
                v-model="password"
                label="Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :rules="rules.password"
                required
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- Remember me checkbox and forgot password link -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="remember"
                  label="Remember me"
                />
                <a
                  class="ms-2 mb-1"
                  href="javascript:void(0)"
                  >Forgot Password?</a
                >
              </div>

              <!-- Login button -->
              <VBtn
                block
                @click="login"
                >Login</VBtn
              >
            </VCol>

            <!-- <VCol cols="12" class="text-center text-base">
              <span>New on our platform?</span>
              <RouterLink class="text-primary ms-2" :to="{ name: 'register' }">
                Create an account
              </RouterLink>
            </VCol> -->

            <!-- Divider for other authentication methods -->
            <VCol
              cols="12"
              class="d-flex align-center"
            >
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol>

            <!-- Authentication providers -->
            <VCol
              cols="12"
              class="text-center"
            >
              <AuthProvider />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <!-- Background images for the authentication page -->
    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />
    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>

<style lang="scss">
/* Importing SCSS styles for the authentication page */
@use '@core/scss/pages/page-auth.scss';
</style>

<route lang="yaml">
meta:
  layout: blank
</route>

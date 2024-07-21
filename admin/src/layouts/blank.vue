<script setup>
import { useMainStore } from '@/store'
import DrawerContent from '@/layouts/components/DrawerContent.vue'
import { VerticalNavLayout } from '@layouts'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

onBeforeMount(() => {
  useMainStore().init()
})
</script>

<template>
  <VApp>
    <VLayout class="layout-wrapper">
      <!-- 👉 Pages -->
      <div class="layout-page-content">
        <RouterView />
      </div>

      <!-- 👉 Footer -->
      <template #footer>
        <Footer />
      </template>
    </VLayout>
  </VApp>
</template>

<style lang="scss">
@use '@layouts/styles/default-layout';
</style>

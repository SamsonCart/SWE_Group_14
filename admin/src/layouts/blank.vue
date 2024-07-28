<script setup>
import { useMainStore } from '@/store'

// Components
import Footer from '@/layouts/components/Footer.vue'

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

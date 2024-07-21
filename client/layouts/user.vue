<script setup>
import { useUserStore } from '@/store'
import Header from '@/components/general/Header'
import Footer from '@/components/general/footer/Index'

</script>

<template>
  <div>
    <Header />
    <div class="container mt-4">
      <slot />
    </div>
    <!-- <Footer /> -->
  </div>
</template>

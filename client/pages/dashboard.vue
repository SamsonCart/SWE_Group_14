<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store';
import Business from '@/components/dashboard/Business';
import Customer from '@/components/dashboard/Customer';

definePageMeta({
  layout: 'user',
  middleware: 'auth'
});

const userStore = useUserStore();
</script>
<template>
  <h1 class="mb-4">
    {{ userStore.isBusiness === true ? 'Business' : 'Customer' }} Dashboard
  </h1>
  <Business v-if="userStore.isBusiness === true" />
  <Customer v-else />
</template>

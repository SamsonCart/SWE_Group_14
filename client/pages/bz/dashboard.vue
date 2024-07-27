<script setup>
import { useBusinessStore } from '@/store';
import BusinessForm from '@/components/business/BusinessForm';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
});

const businessStore = useBusinessStore();

onMounted(async () => {
  if (!businessStore.business?._id) {
    await businessStore.getUserBusiness();
  }
});
</script>

<template>
  <h2 class="card-title">My Business</h2>
  <BusinessForm :business="businessStore.business" />
</template>

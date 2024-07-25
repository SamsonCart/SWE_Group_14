<script setup>
import { useUserStore } from '@/store';
import BusinessForm from '@/components/business/BusinessForm';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
});

const userStore = useUserStore();
</script>
<template>
  <h2 class="card-title">My Business</h2>
  <BusinessForm />
</template>

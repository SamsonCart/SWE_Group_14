<!-- Business dashboard -->
<script setup>
import { useBusinessStore } from '@/store';
import BusinessForm from '@/components/business/BusinessForm';

definePageMeta({
  layout: 'dashboard' // Defining the layout of the page as 'dashboard'
});

const businessStore = useBusinessStore(); // Initializing the business store

// Fetch the logged-in user's business data on component mount
onMounted(async () => {
  if (!businessStore.business?._id) {
    // Check if the business data is already loaded
    await businessStore.getUserBusiness(); // Fetch the user's business data if not loaded
  }
});
</script>

<template>
  <h2 class="card-title">My Business</h2>
  <BusinessForm :business="businessStore.business" />
</template>

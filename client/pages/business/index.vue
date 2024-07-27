<template>
  <h3>Local Businesses</h3>
  <v-row v-if="businesses.length">
    <v-col
      class="p"
      cols="6"
      v-for="business in businesses"
      :key="business._id"
    >
      <BusinessCard :business="business" />
    </v-col>
  </v-row>
  <v-alert v-else type="info"
    >No services found. Try adjusting your search criteria.</v-alert
  >
</template>

<script setup>
import BusinessCard from '@/components/customer/BusinessCard.vue';

const baseUrl = import.meta.env.VITE_API_ENDPOINT;
const businesses = ref([]);

const fetchBusinesses = async () => {
  try {
    const response = await $fetch(`${baseUrl}/business`);
    businesses.value = response.data;
  } catch (error) {
    console.error('Error fetching businesses:', error);
  }
};

onMounted(() => {
  fetchBusinesses();
});
</script>

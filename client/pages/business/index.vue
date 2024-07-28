<template>
  <h3>Local Businesses</h3>

  <!-- Display a list of businesses if available -->
  <v-row v-if="businesses.length">
    <v-col
      class="p"
      cols="6"
      v-for="business in businesses"
      :key="business._id"
    >
      <!-- Component to display individual business details -->
      <BusinessCard :business="business" />
    </v-col>
  </v-row>

  <!-- Show a message if no businesses are found -->
  <v-alert v-else type="info">
    No businesses found. Try adjusting your search criteria.
  </v-alert>
</template>

<script setup>
import BusinessCard from '@/components/customer/BusinessCard.vue'; // Import the BusinessCard component

const baseUrl = import.meta.env.VITE_API_ENDPOINT; // Retrieve the base API URL from environment variables
const businesses = ref([]); // Reactive reference to store the list of businesses

// Function to fetch businesses from the API
const fetchBusinesses = async () => {
  try {
    const response = await $fetch(`${baseUrl}/business`); // Fetch data from the API
    businesses.value = response.data; // Update the businesses list with the fetched data
  } catch (error) {
    console.error('Error fetching businesses:', error); // Log any errors that occur
  }
};

// Lifecycle hook to fetch businesses when the component is mounted
onMounted(() => {
  fetchBusinesses();
});
</script>

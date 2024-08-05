<template>
  <v-container>
    <v-card-title class="text-h4 text-center mb-5">Local Business</v-card-title>
    <!-- Search input -->
    <v-text-field
      v-model="searchQuery"
      label="Search"
      class="mb-4"
      @input="debouncedSearch"
    />

    <!-- Show loader when loading -->
    <v-row v-if="loading">
      <v-col class="d-flex justify-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Display a list of businesses if available -->
    <v-row v-if="!loading && businesses.length">
      <v-col
        lg="3"
        md="4"
        sm="12"
        class="d-flex"
        v-for="business in businesses"
        :key="business._id"
      >
        <!-- Component to display individual business details -->
        <BusinessCard :business="business" />
      </v-col>
    </v-row>

    <!-- Show a message if no businesses are found -->
    <v-alert v-else-if="!loading" type="info">
      No businesses found. Try adjusting your search criteria.
    </v-alert>
  </v-container>
</template>

<script setup>
import { debounce } from 'lodash-es';
import BusinessCard from '@/components/customer/BusinessCard.vue'; // Import the BusinessCard component

const baseUrl = import.meta.env.VITE_API_ENDPOINT; // Retrieve the base API URL from environment variables
const businesses = ref([]); // Reactive reference to store the list of businesses
const searchQuery = ref(''); // Reactive reference for search input
const loading = ref(false); // Reactive reference for loading state

// Function to fetch businesses from the API
const fetchBusinesses = async () => {
  loading.value = true;
  try {
    const response = await $fetch(`${baseUrl}/business`, {
      params: { query: searchQuery.value } // Pass search query as parameter
    }); // Fetch data from the API
    businesses.value = response.data; // Update the businesses list with the fetched data
  } catch (error) {
    console.error('Error fetching businesses:', error); // Log any errors that occur
  } finally {
    loading.value = false;
  }
};

// Debounced search function
const debouncedSearch = debounce(fetchBusinesses, 500);

// Lifecycle hook to fetch businesses when the component is mounted
onMounted(() => {
  fetchBusinesses();
});
</script>

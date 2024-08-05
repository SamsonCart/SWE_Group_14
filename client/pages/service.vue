<template>
  <v-container>
    <v-card-title class="text-h4 text-center mb-5">Local Services</v-card-title>

    <!-- Search input -->
    <v-text-field
      v-model="searchQuery"
      label="Search"
      class="mb-4"
      @input="debouncedSearch"
    />

    <!-- Loader component -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="my-5"
    ></v-progress-circular>

    <!-- Display services if available -->
    <v-row v-if="!loading && services.length">
      <v-col
        lg="3"
        md="4"
        sm="12"
        class="d-flex"
        v-for="service in services"
        :key="service._id"
      >
        <!-- Component to display individual service details -->
        <ServiceCard :service="service" />
      </v-col>
    </v-row>

    <!-- Show a message if no services are found -->
    <v-alert v-else-if="!loading" type="info">
      No services found. Try adjusting your search criteria.
    </v-alert>
  </v-container>
</template>

<script setup>
import { debounce } from 'lodash-es';
import ServiceCard from '@/components/customer/ServiceCard.vue'; // Import ServiceCard component

const baseUrl = import.meta.env.VITE_API_ENDPOINT; // Retrieve the API endpoint from environment variables
const services = ref([]); // Reactive reference to store the list of services
const searchQuery = ref(''); // Reactive reference for search input
const loading = ref(false); // Reactive reference for loading state

// Function to fetch services from the API
const fetchServices = async () => {
  loading.value = true;
  try {
    const response = await $fetch(`${baseUrl}/service`, {
      params: { query: searchQuery.value } // Pass search query as parameter
    }); // Fetch data from the API
    services.value = response.data; // Update the services list with the fetched data
  } catch (error) {
    console.error('Error fetching services:', error); // Log any errors that occur
  } finally {
    loading.value = false;
  }
};

// Debounced search function
const debouncedSearch = debounce(fetchServices, 500);

// Lifecycle hook to fetch services when the component is mounted
onMounted(() => {
  fetchServices();
});
</script>

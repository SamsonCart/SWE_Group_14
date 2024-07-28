<template>
  <h3>Local Services</h3>
  
  <!-- Display services if available -->
  <v-row v-if="services.length">
    <v-col
      class="p"
      cols="6"
      v-for="service in services"
      :key="service._id"
    >
      <!-- Component to display individual service details -->
      <ServiceCard :service="service" />
    </v-col>
  </v-row>

  <!-- Show a message if no services are found -->
  <v-alert v-else type="info">
    No services found. Try adjusting your search criteria.
  </v-alert>
</template>

<script setup>
import ServiceCard from '@/components/customer/ServiceCard.vue'; // Import ServiceCard component

const baseUrl = import.meta.env.VITE_API_ENDPOINT; // Retrieve the API endpoint from environment variables
const services = ref([]); // Reactive reference to store the list of services

// Function to fetch services from the API
const fetchServices = async () => {
  try {
    const response = await $fetch(`${baseUrl}/service`); // Fetch data from the API
    services.value = response.data; // Update the services list with the fetched data
  } catch (error) {
    console.error('Error fetching services:', error); // Log any errors that occur
  }
};

// Lifecycle hook to fetch services when the component is mounted
onMounted(() => {
  fetchServices();
});
</script>

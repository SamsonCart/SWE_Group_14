<template>
  <!-- Display business information if available -->
  <BusinessInfo
    v-if="business"
    :business="business"
    :services="services"
  />
</template>

<script setup>
import BusinessInfo from '@/components/customer/BusinessInfo.vue'; // Import the BusinessInfo component

const baseUrl = import.meta.env.VITE_API_ENDPOINT; // Retrieve the base API URL from environment variables

const route = useRoute(); // Access route parameters
console.log('route.params.id', route.params.id); // Log the business ID from the route parameters

const business = ref(null); // Reactive reference to store business details
const services = ref([]); // Reactive reference to store services related to the business

// Function to fetch details of a specific business by ID
const fetchBusinessDetails = async (id) => {
  try {
    const response = await $fetch(`${baseUrl}/business/${id}`); // Fetch business details from the API
    console.log('fetchBusinessDetails :>> ', response); // Log the response data
    business.value = response.data; // Update the business details with the fetched data
  } catch (error) {
    console.error('Error fetching business details:', error); // Log any errors that occur
  }
};

// Function to fetch services related to a specific business by ID
const fetchBusinessServices = async (id) => {
  try {
    const response = await $fetch(`${baseUrl}/service`, {
      params: { businessId: id } // Pass business ID as a query parameter
    });
    console.log('fetchBusinessServices :>> ', response); // Log the response data
    services.value = response.data; // Update the services list with the fetched data
  } catch (error) {
    console.error('Error fetching business services:', error); // Log any errors that occur
  }
};

// Lifecycle hook to fetch business details, and services when the component is mounted
onMounted(() => {
  const { id } = route.params; // Get the business ID from the route parameters
  fetchBusinessDetails(id); // Fetch business details
  fetchBusinessServices(id); // Fetch related services
});
</script>

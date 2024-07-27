<template>
    <h3>Local Services</h3>
    <v-row v-if="services.length">
      <v-col
        class="p"
        cols="6"
        v-for="service in services"
        :key="service._id"
      >
        <ServiceCard :service="service" />
      </v-col>
    </v-row>
    <v-alert v-else type="info">
      No services found. Try adjusting your search criteria.
    </v-alert>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import ServiceCard from '@/components/customer/ServiceCard.vue';
  
  const baseUrl = import.meta.env.VITE_API_ENDPOINT;
  const services = ref([]);
  
  const fetchServices = async () => {
    try {
      const response = await $fetch(`${baseUrl}/service`);
      services.value = response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  
  onMounted(() => {
    fetchServices();
  });
  </script>
  
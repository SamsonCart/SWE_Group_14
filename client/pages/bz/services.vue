<script setup>
import { useBusinessStore, useUserStore } from '@/store'; // Import the necessary stores
import ServiceCard from '@/components/business/ServiceCard.vue'; // Import the ServiceCard component
import ServiceForm from '@/components/business/ServiceForm.vue'; // Import the ServiceForm component
import { ref, onMounted } from 'vue'; // Import ref and onMounted from Vue

// Define metadata for the page layout
definePageMeta({
  layout: 'dashboard'
});

const userStore = useUserStore(); // Initialize the user store
const businessStore = useBusinessStore(); // Initialize the business store

// Fetch business and services data when the component is mounted
onMounted(async () => {
  if (!businessStore.business._id) {
    await businessStore.getUserBusiness(); // Fetch user business if not already loaded
  }
  await businessStore.getBusinessServices(); // Fetch business services
});

const editDialog = ref(false); // Reactive variable to control the visibility of the edit dialog
const createDialog = ref(false); // Reactive variable to control the visibility of the create dialog
const selectedService = ref(null); // Reactive variable to store the selected service

// Handle the editing of a service
const handleEdit = (service) => {
  selectedService.value = { ...service }; // Set the selected service
  editDialog.value = true; // Show the edit dialog
};

// Handle the deletion of a service
const handleDelete = async (service) => {
  await businessStore.deleteService(service._id); // Delete the service
  await businessStore.getBusinessServices(); // Refresh the list of services
};

// Submit the service form (create or update a service)
const submitForm = async (service) => {
  if (selectedService.value._id) {
    // If in edit mode, update the service
    const serviceId = selectedService.value._id;
    const serviceData = {
      businessId: service.businessId,
      title: service.title,
      description: service.description,
      price: service.price,
      availability: service.availability.map((item) => ({
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        sessionDuration: item.sessionDuration
      }))
    };
    await businessStore.updateService(serviceId, serviceData); // Update the service
  } else {
    // If not in edit mode, create a new service
    const serviceData = {
      businessId: businessStore.business._id,
      title: service.title,
      description: service.description,
      price: service.price,
      availability: service.availability.map((item) => ({
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        sessionDuration: item.sessionDuration
      }))
    };
    await businessStore.createService(serviceData); // Create a new service
  }
  await businessStore.getBusinessServices(); // Refresh the list of services
  editDialog.value = false; // Hide the edit dialog
  createDialog.value = false; // Hide the create dialog
};

// Handle the creation of a new service
const handleCreate = () => {
  selectedService.value = {
    title: '',
    description: '',
    price: '',
    availability: [
      {
        dayOfWeek: 0,
        startTime: '09:00',
        endTime: '18:00',
        sessionDuration: 60
      }, // Monday
      {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '18:00',
        sessionDuration: 60
      }, // Tuesday
      {
        dayOfWeek: 2,
        startTime: '09:00',
        endTime: '18:00',
        sessionDuration: 60
      }, // Wednesday
      {
        dayOfWeek: 3,
        startTime: '09:00',
        endTime: '18:00',
        sessionDuration: 60
      }, // Thursday
      {
        dayOfWeek: 4,
        startTime: '09:00',
        endTime: '18:00',
        sessionDuration: 60
      } // Friday
    ]
  };
  createDialog.value = true; // Show the create dialog
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="d-flex justify-end mb-4">
        <!-- Button to create a new service -->
        <v-btn color="primary" @click="handleCreate">Create New Service</v-btn>
      </v-col>
      <!-- Loop through services and display each service in a card -->
      <v-col
        v-for="service in businessStore.services"
        :key="service._id"
        cols="12"
        md="6"
      >
        <ServiceCard
          :key="service._id"
          :service="service"
          @edit="handleEdit"
          @delete="handleDelete"
        ></ServiceCard>
      </v-col>
    </v-row>
    <!-- Service form dialog for editing a service -->
    <ServiceForm
      v-model="editDialog"
      :service="selectedService"
      :isEditMode="true"
      @submit="submitForm"
    ></ServiceForm>
    <!-- Service form dialog for creating a new service -->
    <ServiceForm
      v-model="createDialog"
      :service="selectedService"
      :isEditMode="false"
      @submit="submitForm"
    ></ServiceForm>
  </v-container>
</template>

<style scoped>
/* Add any necessary styling here */
</style>

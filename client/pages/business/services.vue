<script setup>
import { useBusinessStore, useUserStore } from '@/store';
import ServiceCard from '@/components/business/ServiceCard.vue';
import ServiceForm from '@/components/business/ServiceForm.vue';
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
});

const userStore = useUserStore();
const businessStore = useBusinessStore();

onMounted(async () => {
  if (!businessStore.business._id) {
    await businessStore.getUserBusiness();
  }
  await businessStore.getBusinessServices();
});

const editDialog = ref(false);
const createDialog = ref(false);
const selectedService = ref(null);

const handleEdit = (service) => {
  selectedService.value = { ...service };
  editDialog.value = true;
};

const handleDelete = async (service) => {
  await businessStore.deleteService(service._id);
  await businessStore.getBusinessServices();
};

const submitForm = async (service) => {
  if (selectedService.value._id) {
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
    await businessStore.updateService(serviceId, serviceData);
  } else {
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
    await businessStore.createService(serviceData);
  }
  await businessStore.getBusinessServices();
  editDialog.value = false;
  createDialog.value = false;
};

const handleCreate = () => {
  selectedService.value = {
    title: '',
    description: '',
    price: '',
    availability: [
      {
        dayOfWeek: 0,
        startTime: '09:00',
        endTime: '17:00',
        sessionDuration: 40
      }, // Monday
      {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        sessionDuration: 40
      }, // Tuesday
      {
        dayOfWeek: 2,
        startTime: '09:00',
        endTime: '17:00',
        sessionDuration: 40
      }, // Wednesday
      {
        dayOfWeek: 3,
        startTime: '09:00',
        endTime: '17:00',
        sessionDuration: 40
      }, // Thursday
      {
        dayOfWeek: 4,
        startTime: '09:00',
        endTime: '17:00',
        sessionDuration: 40
      } // Friday
    ]
  };
  createDialog.value = true;
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="d-flex justify-end mb-4">
        <v-btn color="primary" @click="handleCreate">Create New Service</v-btn>
      </v-col>
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
    <ServiceForm
      v-model="editDialog"
      :service="selectedService"
      :isEditMode="true"
      @submit="submitForm"
    ></ServiceForm>
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

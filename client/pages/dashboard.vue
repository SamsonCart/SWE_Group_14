
<template>
  <v-container>
    <!-- Search for local services -->
    <SearchServiceForm
      :searchRadius="searchRadius"
      :serviceType="serviceType"
      @search="fetchServices"
    />

    <!-- Display search results -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Local Businesses</v-card-title>
          <v-card-text>
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Local Services</v-card-title>
          <v-card-text>
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
            <v-alert v-else type="info"
              >No services found. Try adjusting your search criteria.</v-alert
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent bookings -->
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-title>My Recent Bookings</v-card-title>
          <v-card-text>
            <v-list v-if="bookings.length">
              <v-list-item
                v-for="booking in bookings"
                :key="booking.id"
                :to="`/bookings`"
              >
                <v-list-item-content>
                  <v-list-item-subtitle class="d-flex justify-space-between">
                    {{ new Date(booking.date).toDateString() }}
                    <v-chip :color="statusColor(booking.status)">
                      {{ booking.status }}
                    </v-chip>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    >Service: {{ booking.service.name }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-alert v-else type="info">No recent bookings.</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import SearchServiceForm from '@/components/customer/SearchServiceForm';
import BusinessCard from '@/components/customer/BusinessCard';
import ServiceCard from '@/components/customer/ServiceCard';
import { useUserStore } from '@/store';

const searchRadius = ref(20);
const serviceType = ref('');
const businesses = ref([]);
const services = ref([]);
const bookings = ref([]);

const baseUrl = import.meta.env.VITE_API_ENDPOINT;

const fetchBusinesses = async () => {
  try {
    const response = await $fetch(`${baseUrl}/business`);
    if (response?.data) {
      businesses.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching businesses:', error);
  }
};

const fetchServices = async () => {
  try {
    const response = await $fetch(`${baseUrl}/service`);
    if (response?.data) {
      services.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

const fetchMyBookings = async () => {
  try {
    const userStore = useUserStore();
    const customerId = userStore.getUser.id;
    const response = await $fetch(`${baseUrl}/booking`, {
      method: 'get',
      query: { customerId }
    });
    if (response?.data) {
      bookings.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
};

onMounted(async () => {
  await fetchBusinesses();
  await fetchServices();
  await fetchMyBookings();
});

const statusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'confirmed':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return '';
  }
};
</script>

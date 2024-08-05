<template>
  <v-container>
    <!-- Section for displaying user bookings -->
    <h4 class="text-h4 text-center mb-5">My Bookings</h4>
    <v-row v-if="bookings.length">
      <v-col lg="6" sm="12" v-for="booking in bookings" :key="booking.id">
        <v-card outlined>
          <v-card-title>
            {{ booking.service.name }}
            <v-spacer></v-spacer>
            <v-chip :color="statusColor(booking.status)" small>{{
              booking.status
            }}</v-chip>
          </v-card-title>
          <v-card-subtitle>
            {{ new Date(booking.date).toDateString() }} -
            {{ booking.startTime }} ~ {{ booking.endTime }}
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col> <strong>Price:</strong> {{ booking.price }} </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <strong>Business:</strong>
                <br />
                {{ booking.business.name }}
                <br />
                {{ booking.business.email }}
                <br />
                {{ booking.business.phonenumber }}
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <strong>Customer:</strong>
                <br />
                {{ booking.customerEmail }}
                <br />
                {{ booking.customerName }}
                <br />
                {{ booking.customerPhonenumber }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Alert message if no bookings are found -->
    <v-alert v-else type="info"> No bookings found. </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/store'; // Import user store for accessing user data

const bookings = ref([]); // State variable for storing user bookings

const userStore = useUserStore(); // Get the user store instance

const user = computed(() => userStore.getUser); // Computed property to get the current user

const baseUrl = import.meta.env.VITE_API_ENDPOINT; // Base URL for API requests

// Function to fetch user's bookings from the API
const fetchMyBookings = async () => {
  try {
    const customerId = user.value.id;
    const response = await $fetch(`${baseUrl}/booking`, {
      method: 'GET',
      params: { customerId }
    });
    if (response?.data) {
      bookings.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
};

// Lifecycle hook to fetch data when the component is mounted
onMounted(async () => {
  await fetchMyBookings();
});

// Function to determine color for booking status chip
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

<style scoped></style>

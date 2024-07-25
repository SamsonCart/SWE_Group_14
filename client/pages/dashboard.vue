<script setup>
import SearchServiceForm from '@/components/customer/SearchServiceForm';
import ServiceCard from '@/components/customer/ServiceCard';

const searchRadius = ref(20);
const serviceType = ref('');
const services = ref([]);
const bookings = ref([]);
const reviews = ref([]);

const baseUrl = import.meta.env.VITE_API_ENDPOINT;

const fetchServices = async () => {
  try {
    const response = await $fetch(`${baseUrl}/service`, {
      // params: { radius: searchRadius.value, type: serviceType.value }
    });
    if (response) {
      services.value = response;
    }
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

const fetchBookings = async () => {
  try {
    const response = await $fetch(`${baseUrl}/bookings`);
    if (response) {
      bookings.value = response;
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
};

const fetchReviews = async () => {
  // try {
  //   const response = await $fetch(`${baseUrl}/reviews`);
  //   if (response) {
  //     reviews.value = response;
  //   }
  // } catch (error) {
  //   console.error('Error fetching reviews:', error);
  // }
};

const openWriteReviewModal = () => {
  // Implement modal opening logic here
};

onMounted(() => {
  fetchServices();
  // fetchBookings();
  // fetchReviews();
});
</script>

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
          <v-card-title>Local Service Providers</v-card-title>
          <v-card-text>
            <v-row v-if="services.length">
              <v-col class="p" cols="6" v-for="service in services" :key="service.id">
                <ServiceCard
                  :service="service"
                />
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
              <v-list-item v-for="booking in bookings" :key="booking.id">
                <v-list-item-content>
                  <v-list-item-title>{{
                    booking.businessName
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    booking.date
                  }}</v-list-item-subtitle>
                  <v-list-item-subtitle
                    >Service: {{ booking.serviceType }}</v-list-item-subtitle
                  >
                  <v-list-item-subtitle
                    >Price: ${{ booking.price }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-alert v-else type="info">No recent bookings.</v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Reviews section -->
      <v-col cols="6">
        <v-card>
          <v-card-title>My Reviews</v-card-title>
          <v-card-text>
            <v-list v-if="reviews.length">
              <v-list-item v-for="review in reviews" :key="review.id">
                <v-list-item-content>
                  <v-list-item-title>{{
                    review.businessName
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{ review.date }}</v-list-item-subtitle>
                  <v-list-item-subtitle
                    >Rating: {{ review.rating }} / 5</v-list-item-subtitle
                  >
                  <v-list-item-subtitle>{{
                    review.comment
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-alert v-else type="info"
              >You haven't written any reviews yet.</v-alert
            >
            <v-btn color="primary" @click="openWriteReviewModal" class="mt-3"
              >Write a Review</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<template>
  <v-container>
    <!-- Section for searching local businesses -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Find Local Business</v-card-title>
          <v-card-text>
            <!-- Form for inputting search radius and submitting search -->
            <v-form @submit.prevent="onSubmit">
              <v-row>
                <v-col cols="8">
                  <v-text-field
                    v-model="searchRadius"
                    label="Search Radius (miles)"
                    type="number"
                    max="20"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-btn
                    type="submit"
                    color="primary"
                    :disabled="!userCoordinates"
                  >
                    Search
                  </v-btn>
                </v-col>
              </v-row>
              <!-- Alert message if user coordinates are not set -->
              <v-alert v-if="!userCoordinates" type="warning" class="mt-3">
                You can search if you set your location in your profile page.
                <router-link to="/profile">Go to Profile</router-link>
              </v-alert>
            </v-form>
            <!-- Map component displaying the search area and businesses -->
            <div>
              <l-map
                style="height: 500px; width: 100%"
                :zoom="10"
                :center="mapCenterCoordinates"
              >
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                ></l-tile-layer>
                <!-- Circle indicating the search radius in meters -->
                <l-circle
                  :lat-lng="mapCenterCoordinates"
                  :radius="searchRadius * 1609.34"
                >
                  >
                </l-circle>
                <!-- Markers for each valid business -->
                <l-marker
                  v-for="business in validBusinesses"
                  :key="business._id"
                  :lat-lng="[
                    business.address.coordinates.latitude,
                    business.address.coordinates.longitude
                  ]"
                >
                  <l-popup>
                    <b>{{ business.businessName }}</b
                    ><br />
                    {{ business.address.street }}<br />
                    <router-link :to="`/business/${business._id}`"
                      >View Details</router-link
                    >
                  </l-popup>
                </l-marker>
              </l-map>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section to display search results -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Local Businesses</v-card-title>
          <v-card-text>
            <!-- Display businesses if available -->
            <v-row v-if="businesses.length">
              <v-col
                class="p"
                cols="12"
                md="4"
                v-for="business in businesses"
                :key="business._id"
              >
                <BusinessCard :business="business" />
              </v-col>
            </v-row>
            <!-- Alert message if no businesses are found -->
            <v-alert v-else type="info">
              No businesses found. Try adjusting your search criteria.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section for recent bookings -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>My Recent Bookings</v-card-title>
          <v-card-text>
            <!-- List of recent bookings if available -->
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
                  <v-list-item-subtitle>
                    Service: {{ booking.service.name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <!-- Alert message if no recent bookings -->
            <v-alert v-else type="info"> No recent bookings. </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useUserStore } from '@/store'; // Import user store for accessing user data
import BusinessCard from '@/components/customer/BusinessCard'; // Import BusinessCard component for displaying business details
import { ref, computed, onMounted } from 'vue'; // Import Vue composition API functions
import { useRouter } from 'vue-router'; // Import Vue Router for navigation

const searchRadius = ref(20); // State variable for the search radius
const businesses = ref([]); // State variable for storing fetched businesses
const bookings = ref([]); // State variable for storing user bookings

const userStore = useUserStore(); // Get the user store instance
const router = useRouter(); // Get the router instance

const user = computed(() => userStore.getUser); // Computed property to get the current user

// Computed property for user coordinates; returns null if not available
const userCoordinates = computed(() => {
  if (
    user.value.address &&
    user.value.address.coordinates &&
    user.value.address.coordinates.latitude &&
    user.value.address.coordinates.longitude
  ) {
    return [
      user.value.address.coordinates.latitude,
      user.value.address.coordinates.longitude
    ];
  }
  return null;
});

const defaultCenterCoordinates = [34.0522, -118.2437]; // Default center coordinates for the map (Los Angeles)

// Computed property to determine the map center; uses user coordinates if available
const mapCenterCoordinates = computed(() => {
  return userCoordinates.value
    ? userCoordinates.value
    : defaultCenterCoordinates;
});

const baseUrl = import.meta.env.VITE_API_ENDPOINT; // Base URL for API requests

// Computed property to filter businesses that have valid coordinates
const validBusinesses = computed(() => {
  return businesses.value.filter(
    (business) =>
      business.address &&
      business.address.coordinates &&
      business.address.coordinates.latitude &&
      business.address.coordinates.longitude
  );
});

// Function to handle form submission
const onSubmit = () => {
  if (userCoordinates.value || defaultCenterCoordinates) {
    filterBusinessByDistance();
  } else {
    alert(
      'Please update your address information to search for local businesses.'
    );
  }
};

// Function to fetch all businesses from the API
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

// Function to filter businesses based on distance from the user's location
const filterBusinessByDistance = async () => {
  try {
    const customerId = user.value.id;
    const distance = searchRadius.value;
    const response = await $fetch(`${baseUrl}/business/near`, {
      method: 'GET',
      params: { customerId, distance }
    });
    if (response?.data) {
      businesses.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching businesses:', error);
  }
};

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
  await fetchBusinesses();
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

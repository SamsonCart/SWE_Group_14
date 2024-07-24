<script setup>
const searchRadius = ref(20);
const serviceType = ref('');
const businesses = ref([]);
const bookings = ref([]);
const reviews = ref([]);
const searchBusinesses = () => {
  // Implement API call to search for businesses within the specified radius and service type
  // Update the businesses ref with the results
};
const viewBusinessProfile = (businessId) => {
  // Implement navigation to business profile page
  // This page should show detailed information, including address, images, and location on a map
};
const openWriteReviewModal = () => {
  // Implement a modal or navigate to a page for writing a new review
};
// Fetch initial data
onMounted(() => {
  // Fetch recent bookings
  // Fetch user's reviews
});
</script>
<template>
  <div class="row">
    <!-- Search for local businesses -->
    <div class="col-md-4">
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Find Local Services</h5>
          <form @submit.prevent="searchBusinesses">
            <div class="mb-3">
              <label for="searchRadius" class="form-label"
                >Search Radius (miles)</label
              >
              <input
                type="number"
                class="form-control"
                id="searchRadius"
                v-model="searchRadius"
                max="20"
              />
            </div>
            <div class="mb-3">
              <label for="serviceType" class="form-label">Service Type</label>
              <select
                class="form-select"
                id="serviceType"
                v-model="serviceType"
              >
                <option value="">All Services</option>
                <option value="plumber">Plumber</option>
                <option value="makeup">Makeup Artist</option>
                <option value="ac">AC Repair</option>
                <!-- Add more service types as needed -->
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Search</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Display search results -->
    <div class="col-md-8">
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Local Service Providers</h5>
          <div v-if="businesses.length" class="list-group">
            <a
              v-for="business in businesses"
              :key="business.id"
              href="#"
              class="list-group-item list-group-item-action"
              @click.prevent="viewBusinessProfile(business.id)"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ business.name }}</h5>
                <small>{{ business.distance }} miles away</small>
              </div>
              <p class="mb-1">{{ business.description }}</p>
              <small>Rating: {{ business.rating }} / 5</small>
            </a>
          </div>
          <p v-else>No businesses found. Try adjusting your search criteria.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Recent bookings -->
  <div class="row">
    <div class="col-md-6">
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">My Recent Bookings</h5>
          <div v-if="bookings.length" class="list-group">
            <a
              v-for="booking in bookings"
              :key="booking.id"
              href="#"
              class="list-group-item list-group-item-action"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ booking.businessName }}</h5>
                <small>{{ booking.date }}</small>
              </div>
              <p class="mb-1">{{ booking.serviceType }}</p>
              <small>Price: ${{ booking.price }}</small>
            </a>
          </div>
          <p v-else>No recent bookings.</p>
        </div>
      </div>
    </div>

    <!-- Reviews section -->
    <div class="col-md-6">
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">My Reviews</h5>
          <div v-if="reviews.length" class="list-group">
            <a
              v-for="review in reviews"
              :key="review.id"
              href="#"
              class="list-group-item list-group-item-action"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ review.businessName }}</h5>
                <small>{{ review.date }}</small>
              </div>
              <p class="mb-1">Rating: {{ review.rating }} / 5</p>
              <small>{{ review.comment }}</small>
            </a>
          </div>
          <p v-else>You haven't written any reviews yet.</p>
          <button class="btn btn-primary mt-3" @click="openWriteReviewModal">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

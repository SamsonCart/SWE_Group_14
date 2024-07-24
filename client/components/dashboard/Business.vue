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
  <!-- Recent bookings -->
  <div class="row">
    <div class="col-md-6">
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">My Businesses</h5>
          
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

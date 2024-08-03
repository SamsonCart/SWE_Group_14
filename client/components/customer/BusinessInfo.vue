<!-- components/customer/BusinessInfo.vue -->
<template>
  <v-container>
    <v-container>
      <v-card class="mb-4">
        <v-card-title class="text-h4 text-center">{{
          business.name
        }}</v-card-title>
        <v-card-text>
          <!-- Display carousel of business images if available -->
          <v-carousel v-if="business.images && business.images.length > 0">
            <v-carousel-item
              v-for="(img, index) in business.images"
              :key="index"
              :src="`${baseUrl}/uploads/images/${img}`"
              aspect-ratio="3/4"
              class="carousel-item"
            ></v-carousel-item>
          </v-carousel>

          <v-list>
            <v-list-item>
              <v-list-item-content>{{
                business.description
              }}</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Contact</v-list-item-title>
                <v-list-item-subtitle>
                  <div class="contact-info">
                    <v-icon left size="16" class="mr-2">mdi-phone</v-icon>
                    {{ business.phonenumber }}
                    <v-icon left size="16" class="mr-2">mdi-email</v-icon>
                    {{ business.email }}
                  </div>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Address</v-list-item-title>
                <v-list-item-subtitle>
                  <v-icon left size="16" class="mr-2">mdi-map-marker</v-icon>
                  {{ business.address.street }}, {{ business.address.city }},
                  {{ business.address.state }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <h5 class="text-h5 my-5">Services</h5>
                <v-row v-if="services?.length">
                  <v-col
                    lg="3"
                    md="4"
                    sm="12"
                    v-for="service in services"
                    :key="service._id"
                  >
                    <ServiceCard :service="service" />
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Reviews Section -->
    <v-container>
      <h5 class="text-h5 my-5">Reviews</h5>
      <!-- Display user's review if available -->
      <v-card v-if="myReview" class="mb-5">
        <v-card-title>{{ customerName(myReview.customer) }}</v-card-title>
        <v-card-text>
          <v-rating :model-value="myReview.rating" readonly></v-rating>
          <p>{{ myReview.comment }}</p>
          <p>{{ myReview.business.name }}: {{ myReview.response }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" variant="flat" @click="editReview(myReview)"
            >Edit My Review</v-btn
          >
        </v-card-actions>
      </v-card>
      <!-- Display other reviews -->
      <v-card v-for="review in otherReviews" :key="review._id" class="mb-4">
        <v-card-title>{{ customerName(review.customer) }}</v-card-title>
        <v-card-text>
          <v-rating :model-value="review.rating" readonly></v-rating>
          <p>{{ review.comment }}</p>
          <p>{{ review.business.name }}: {{ review.response }}</p>
        </v-card-text>
      </v-card>
      <!-- Button to write a new review if the user has not reviewed yet -->
      <v-btn variant="tonal" v-if="!myReview" @click="writeReview"
        >Write a Review</v-btn
      >
    </v-container>

    <ReviewForm
      :show="showReviewForm"
      :editMode="!!myReview"
      :review="currentReview"
      :businessId="business._id"
      @update:show="showReviewForm = $event"
      @reviewSubmitted="fetchReviews"
    />

    <!-- Inquiries Section -->
    <v-container>
      <h5 class="text-h5 my-5">Inquiries</h5>
      <!-- Display inquiries and responses -->
      <v-card v-for="inquiry in inquiries" :key="inquiry._id" class="mb-4">
        <v-card-title>
          <v-icon left>mdi-help-circle</v-icon>
          {{ customerName(inquiry.customer) }}: {{ inquiry.content }}
        </v-card-title>
        <v-card-text v-if="inquiry.response">
          <p><v-icon left>mdi-comment-question</v-icon>: {{ inquiry.response.content }}</p>
      
        </v-card-text>
      </v-card>
    </v-container>
    <InquiryForm
      :businessId="business._id"
      @inquirySubmitted="fetchInquiries"
    />
  </v-container>
</template>

<script setup>
import ReviewForm from '@/components/customer/ReviewForm.vue';
import InquiryForm from '@/components/customer/InquiryForm.vue';
import ServiceCard from '@/components/customer/ServiceCard.vue';
import { useUserStore, useNotificationStore } from '@/store';

// Define component properties
const props = defineProps({ business: Object });

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const baseUrl = import.meta.env.VITE_API_ENDPOINT;

const services = ref([]);
const reviews = ref([]);
const myReview = ref(null);
const otherReviews = ref([]);
const showReviewForm = ref(false);
const currentReview = ref(null);
const inquiries = ref([]);

// Fetch business services from API
const fetchBusinessServices = async (id) => {
  try {
    const response = await $fetch(`${baseUrl}/service`, {
      params: { businessId: id }
    });
    if (response.isSuccess) {
      services.value = response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    notificationStore.showError(error.message);
  }
};

// Fetch reviews from API
const fetchReviews = async () => {
  try {
    const response = await $fetch(
      `${baseUrl}/review?businessId=${props.business._id}`
    );
    if (response.isSuccess) {
      reviews.value = response.data;
      myReview.value =
        reviews.value.find(
          (review) => review.customer._id === userStore.user.id
        ) || null;
      otherReviews.value = reviews.value.filter(
        (review) => review.customer._id !== userStore.user.id
      );
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    notificationStore.showError(error.message);
  }
};

// Fetch inquiries from API
const fetchInquiries = async () => {
  try {
    const response = await $fetch(
      `${baseUrl}/inquiry?businessId=${props.business._id}&customerId=${userStore.user.id}`
    );
    if (response.isSuccess) {
      inquiries.value = response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    notificationStore.showError(error.message);
  }
};

// Set review form to write a new review
const writeReview = () => {
  currentReview.value = null;
  showReviewForm.value = true;
};

// Set review form to edit an existing review
const editReview = (review) => {
  currentReview.value = review;
  showReviewForm.value = true;
};

// Get customer name from customer object
const customerName = (customer) => {
  return customer.firstname && customer.lastname
    ? `${customer.firstname} ${customer.lastname}`
    : customer.email;
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchBusinessServices(props.business._id);
  fetchReviews();
  fetchInquiries();
});

// Watch for changes in the business prop and refetch data
watch(props.business, () => {
  fetchBusinessServices(props.business._id);
  fetchReviews();
  fetchInquiries();
});
</script>

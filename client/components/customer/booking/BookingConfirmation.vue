<template>
  <div>
    <h3>Booking Confirmation</h3>
    <p><strong>Service:</strong> {{ service?.title }}</p>
    <p>
      <strong>Date:</strong>
      {{
        bookingDetails.date
          ? new Date(bookingDetails.date).toISOString().substr(0, 10)
          : ''
      }}
      {{ bookingDetails.startTime }} ~ {{ bookingDetails.endTime }}
    </p>
    <p>Price: ${{ bookingDetails.price }}</p>
    <p><strong>Contact Info:</strong></p>
    <p>Name: {{ bookingDetails.customerName }}</p>
    <p>Email: {{ bookingDetails.customerEmail }}</p>
    <p>Phone: {{ bookingDetails.customerPhonenumber }}</p>

    <v-card-actions class="w-100 d-flex justify-content-end">
      <v-btn color="gray" @click="$emit('back')">Back</v-btn>
      <v-btn
        color="primary"
        :disabled="!isBookingDetailsComplete"
        @click="$emit('confirm')"
      >
        Book
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  service: {
    type: Object,
    required: true
  },
  bookingDetails: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['confirm', 'back']);

const isBookingDetailsComplete = computed(() => {
  const { customerName, customerEmail, customerPhonenumber } =
    props.bookingDetails;
  return customerName && customerEmail && customerPhonenumber;
});
</script>

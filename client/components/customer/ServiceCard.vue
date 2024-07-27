<template>
  <v-card class="mx-auto my-4">
    <v-card-title>
      <span>{{ service.title }}</span>
    </v-card-title>
    <v-card-subtitle>{{ service.description }}</v-card-subtitle>
    <v-card-text>
      <strong>Price:</strong> ${{ service.price }} <br />
      <v-btn color="primary" @click="openBookingModal">Book</v-btn>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showModal" max-width="800" scrollable>
    <BookingWidget :service="service" @close="closeBookingModal" />
  </v-dialog>
</template>

<script setup>
import BookingWidget from './BookingWidget.vue';

const props = defineProps({
  service: Object
});
const showModal = ref(false);

const openBookingModal = () => {
  showModal.value = true;
};

const closeBookingModal = () => {
  showModal.value = false;
};
</script>

<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between">
      <span class="text-h5 px-5 py-5 text-center">Book a Service</span>
      <v-btn icon @click="closeModal">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <!-- <v-tabs v-model="activeTab" grow>
        <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
      </v-tabs> -->
      <v-tabs v-model="activeTab" grow>
        <v-tab :value="1">Choose Slot</v-tab>
        <v-tab :value="2">Contacts</v-tab>
        <v-tab :value="3">Confirmation</v-tab>
      </v-tabs>
      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item :value="1" :key="1">
          <BookingSlot
            :service="service"
            :customerId="customerId"
            @slot-selected="handleSlotSelected"
          />
        </v-tabs-window-item>
        <v-tabs-window-item :value="2" :key="2">
          <BookingContact
            :customer="{
              name: bookingDetails.customerName,
              email: bookingDetails.customerEmail,
              phonenumber: bookingDetails.customerPhonenumber
            }"
            @contact-info="handleContactInfo"
            @back="activeTab = 1"
          />
        </v-tabs-window-item>
        <v-tabs-window-item :value="3" :key="3">
          <BookingConfirmation
            :service="service"
            :bookingDetails="bookingDetails"
            @confirm="confirmBooking"
            @back="activeTab = 2"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useUserStore } from '@/store';
import { useNotificationStore } from '@/store/notification';
import BookingSlot from './booking/BookingSlot.vue';
import BookingContact from './booking/BookingContact.vue';
import BookingConfirmation from './booking/BookingConfirmation.vue';

// Define props
const props = defineProps({
  service: Object
});

const emit = defineEmits(['close']);

// Store references
const userStore = useUserStore();
const notificationStore = useNotificationStore();

// Constants
const baseUrl = import.meta.env.VITE_API_ENDPOINT;

// Reactive references
const activeTab = ref(null);
const customerId = userStore.getUser.id;

const bookingDetails = ref({
  serviceId: props.service._id,
  customerId,
  price: props.service.price,
  customerName:
    `${userStore.getUser.firstname} ${userStore.getUser.lastname}` || '',
  customerEmail: userStore.getUser.email || '',
  customerPhonenumber: userStore.getUser.phonenumber || '',
  date: null,
  startTime: null,
  endTime: null
});

const handleSlotSelected = (session) => {
  bookingDetails.value = {
    ...bookingDetails.value,
    date: session.date,
    startTime: session.startTime,
    endTime: session.endTime
  };
  activeTab.value = 2;
};

const handleContactInfo = (contactInfo) => {
  bookingDetails.value = {
    ...bookingDetails.value,
    customerName: contactInfo.name,
    customerEmail: contactInfo.email,
    customerPhonenumber: contactInfo.phonenumber
  };
  activeTab.value = 3;
};

const confirmBooking = async () => {
  try {
    await $fetch(`${baseUrl}/booking`, {
      method: 'post',
      body: bookingDetails.value
    });
    notificationStore.showSuccess('Booked a session successfully');
    activeTab.value = 1;
  } catch (error) {
    notificationStore.showError('Error creating a booking!');
    console.error('Error booking session:', error);
  }
};

const closeModal = () => {
  emit('close');
};
</script>

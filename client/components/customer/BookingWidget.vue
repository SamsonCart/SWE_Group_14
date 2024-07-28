<!-- This script sets up the component with necessary imports and initializations -->
<script setup>
import { useUserStore } from '@/store'; // Importing the user store
import { useNotificationStore } from '@/store/notification'; // Importing the notification store

const props = defineProps({
  service: Object // Defining props with service as an object
});
const emit = defineEmits(['close']); // Defining emits with 'close' event

const notificationStore = useNotificationStore(); // Using the notification store

const selectedDate = ref(new Date()); // Reactive reference for selected date

const availableSessions = ref([]); // Reactive reference for available sessions
const bookedSessions = ref([]); // Reactive reference for booked sessions
const baseUrl = import.meta.env.VITE_API_ENDPOINT; // Base URL for API endpoint from environment variables
const userStore = useUserStore(); // Using the user store
const customerId = userStore.getUser.id; // Getting customer ID from user store
const serviceId = props.service._id; // Getting service ID from props

// Function to generate available sessions for a given date
const generateAvailableSessions = (date) => {
  const sessions = [];
  const startHour = 9; // Assuming service is available from 9 AM
  const endHour = 17; // Assuming service is available until 5 PM
  const sessionDuration = props.service.duration || 1; // Duration in hours, default to 1 hour

  let currentHour = startHour;
  while (currentHour + sessionDuration <= endHour) {
    const sessionId = `${date}-${currentHour}`;
    sessions.push({
      id: sessionId,
      startTime: `${currentHour}:00`,
      endTime: `${currentHour + 1}:00`,
      hours: sessionDuration,
      booked: bookedSessions.value.includes(sessionId) // Checking if session is already booked
    });
    currentHour += sessionDuration;
  }

  return sessions;
};

// Async function to fetch booked sessions for a given date
const fetchBookedSessions = async (date) => {
  try {
    const response = await $fetch(`${baseUrl}/booking`, {
      method: 'get',
      query: { serviceId, date, customerId } // Query parameters for API request
    });
    if (response?.data) {
      bookedSessions.value = response.data.map((booking) => booking.sessionId); // Mapping booked sessions
      availableSessions.value = generateAvailableSessions(date); // Generating available sessions
    }
  } catch (error) {
    console.error('Error fetching booked sessions:', error); // Logging error
  }
};

// Watcher to refetch booked sessions when selected date changes
watch(selectedDate, (newDate) => {
  fetchBookedSessions(newDate);
});

// Initial fetch for the selected date
fetchBookedSessions(selectedDate.value);

// Async function to book a session
const bookSession = async (startTime, endTime) => {
  try {
    console.log('bookSession :>> ', startTime, endTime); // Logging session details
    await $fetch(`${baseUrl}/booking`, {
      method: 'post',
      body: {
        serviceId,
        customerId,
        date: selectedDate.value,
        startTime,
        endTime
      }
    });
    notificationStore.showSuccess('Booked a session successfully'); // Showing success notification
    await fetchBookedSessions(selectedDate.value); // Refresh sessions
  } catch (error) {
    notificationStore.showError('Error creating a booking!'); // Showing error notification
    console.error('Error booking session:', error); // Logging error
  }
};

// Function to emit close event and close the modal
const closeModal = () => {
  emit('close');
};
</script>

<template>
  <!-- Template for the component UI -->
  <v-card>
    <v-card-title class="d-flex justify-space-between">
      <span class="text-h5 px-5 py-5">Book a Session</span>
      <v-btn icon @click="closeModal">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-date-picker
              v-model="selectedDate"
              :min="new Date().toISOString().substr(0, 10)"
              color="primary"
              selected-color="blue darken-3"
            />
          </v-col>
          <v-col cols="3">
            <v-list>
              <v-list-item
                v-for="session in availableSessions.slice(0, 4)"
                :key="service._id"
              >
                <v-list-item-content>
                  <v-list-item-title
                    :class="{ 'text-decoration-line-through': session.booked }"
                    >{{ session.startTime }}</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    Duration: {{ session.hours }} hours
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action v-if="!session.booked">
                  <v-btn
                    color="primary"
                    @click="bookSession(session.startTime, session.endTime)"
                    >Book</v-btn
                  >
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="3">
            <v-list>
              <v-list-item
                v-for="session in availableSessions.slice(4)"
                :key="service._id"
              >
                <v-list-item-content>
                  <v-list-item-title
                    :class="{ 'text-decoration-line-through': session.booked }"
                    >{{ session.startTime }}</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    Duration: {{ session.hours }} hours
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action v-if="!session.booked">
                  <v-btn
                    color="primary"
                    @click="bookSession(session.startTime, session.endTime)"
                    >Book</v-btn
                  >
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.text-decoration-line-through {
  text-decoration: line-through; /* Styling for booked sessions */
}
</style>

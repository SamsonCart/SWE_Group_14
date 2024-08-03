<template>
  <div class="px-5 py-5">
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
            v-for="session in dayBookingSessions.slice(
              0,
              Math.ceil(dayBookingSessions.length / 2)
            )"
            :key="session.id"
          >
            <v-list-item-content class="mb-4">
              <v-list-item-title
                :class="{ 'text-decoration-line-through': session.booked }"
                >{{ session.startTime }}</v-list-item-title
              >
              <v-list-item-subtitle
                >Duration: {{ session.hours }} hour</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                color="primary"
                :disabled="session.booked || selectedSession?.id === session.id"
                @click="selectSession(session)"
                >Select</v-btn
              >
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="3">
        <v-list>
          <v-list-item
            v-for="session in dayBookingSessions.slice(
              Math.ceil(dayBookingSessions.length / 2)
            )"
            :key="session.id"
          >
            <v-list-item-content>
              <v-list-item-title
                :class="{ 'text-decoration-line-through': session.booked }"
                >{{ session.startTime }}</v-list-item-title
              >
              <v-list-item-subtitle
                >Duration: {{ session.hours }} hours</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                color="primary"
                :disabled="session.booked || selectedSession?.id === session.id"
                @click="selectSession(session)"
                >Select</v-btn
              >
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
      <v-card-actions class="w-100 d-flex justify-content-end">
        <v-btn :disabled="!selectedSession" @click="handleNext" color="primary"
          >Next</v-btn
        >
      </v-card-actions>
    </v-row>
  </div>
</template>
<script setup>
// Constants
const baseUrl = import.meta.env.VITE_API_ENDPOINT;

const props = defineProps({
  service: Object,
  customerId: String
});
const emit = defineEmits(['slot-selected']);

const selectedSession = ref(null);
const selectedDate = ref(new Date());

const bookings = ref([]);
const dayBookingSessions = ref([]);

const handleNext = () => {
  emit('slot-selected', selectedSession.value);
};

const selectSession = (session) => {
  selectedSession.value = session;
};

// Function to fetch booked sessions
const fetchBookedSessions = async () => {
  try {
    // Fetch all the booked seesions for the selected day!
    const response = await $fetch(`${baseUrl}/booking`, {
      method: 'get',
      query: { serviceId: props.service._id }
    });
    if (response?.data) {
      bookings.value = response.data.map((item) => ({
        startTime: item.startTime,
        endTime: item.endTime,
        date: item.date
      }));
      dayBookingSessions.value = generateDayBookingSessions();
      console.log('dayBookingSessions :>> ', dayBookingSessions.value);
    }
  } catch (error) {
    console.error('Error fetching booked sessions:', error);
  }
};

// Function to generate available sessions for a given date
const generateDayBookingSessions = () => {
  const sessions = [];
  const startHour = 9; // Assuming service is available from 9 AM
  const endHour = 17; // Assuming service is available until 5 PM
  const sessionDuration = Math.round(props.service.sessionDuration / 60) || 1; // Duration in min
  console.log('generateDayBookingSessions :>> ', sessionDuration);

  let currentHour = startHour;
  while (currentHour + sessionDuration <= endHour) {
    const sessionId = currentHour;
    const startTime = `${currentHour}:00`;
    const endTime = `${currentHour + sessionDuration}:00`;
    sessions.push({
      id: sessionId,
      date: selectedDate.value.toISOString(),
      startTime,
      endTime,
      hours: sessionDuration,
      booked: bookings.value.some((booking) =>
        hasOverlap(booking, selectedDate.value, startTime, endTime)
      ) // Checking if session is already booked
    });
    currentHour += sessionDuration;
  }
  console.log('sessions :>> ', sessions);

  return sessions;
};

// Function to check if a session overlaps with any existing bookings
const hasOverlap = (booking, date, startTime, endTime) => {
  const sessionStart = combineDateAndTime(date, startTime);
  const sessionEnd = combineDateAndTime(date, endTime);
  const bookingStart = combineDateAndTime(
    new Date(booking.date),
    booking.startTime
  );
  const bookingEnd = combineDateAndTime(
    new Date(booking.date),
    booking.endTime
  );
  return sessionStart < bookingEnd && sessionEnd > bookingStart;
};

// Helper function to combine date and time
const combineDateAndTime = (date, timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(year, month, day, hours, minutes);
};

// Watch for changes in selected date
watch(selectedDate, (newDate) => {
  fetchBookedSessions(newDate);
});

// Initial fetch of booked sessions
fetchBookedSessions();
</script>

<style scoped>
.text-decoration-line-through {
  text-decoration: line-through;
}
</style>

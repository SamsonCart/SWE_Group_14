<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { VCalendar } from 'vuetify/labs/VCalendar';

const props = defineProps({
  service: Object
});
const emit = defineEmits(['close']);

const selectedDate = ref(new Date().toISOString().substr(0, 10));
const availableSessions = ref([]);

const generateAvailableSessions = (date) => {
  const sessions = [];
  const startHour = 9; // Assuming service is available from 9 AM
  const endHour = 17; // Assuming service is available until 5 PM
  const sessionDuration = props.service.duration || 1; // Duration in hours, default to 1 hour

  let currentHour = startHour;
  while (currentHour + sessionDuration <= endHour) {
    sessions.push({
      id: `${date}-${currentHour}`,
      startTime: `${currentHour}:00`,
      hours: sessionDuration
    });
    currentHour += sessionDuration;
  }

  return sessions;
};

watch(selectedDate, (newDate) => {
  availableSessions.value = generateAvailableSessions(newDate);
});

// Generate sessions for the initial date
availableSessions.value = generateAvailableSessions(selectedDate.value);

const bookSession = (sessionId) => {
  // Implement booking logic here
  console.log('Booking session:', sessionId);
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
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
            <VCalendar
              v-model:focus="selectedDate"
              :min="new Date().toISOString().substr(0, 10)"
              is-expanded
            />
          </v-col>
          <v-col cols="3">
            <v-list>
              <v-list-item
                v-for="session in availableSessions.slice(0, 4)"
                :key="session.id"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ session.startTime }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Duration: {{ session.hours }} hours
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn color="primary" @click="bookSession(session.id)"
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
                :key="session.id"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ session.startTime }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Duration: {{ session.hours }} hours
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn color="primary" @click="bookSession(session.id)"
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
.v-calendar-month__days > .v-calendar-month__day {
  min-height: 70px !important;
}
</style>

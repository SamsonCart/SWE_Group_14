<template>
  <!-- Service Card Component -->
  <v-card class="mx-auto my-4">
    <v-card-title>
      <!-- Display Service Title -->
      <span>{{ service.title }}</span>
      <v-spacer></v-spacer>
      <!-- Edit Icon -->
      <v-icon @click="editService" class="mr-2">mdi-pencil</v-icon>
      <!-- Delete Icon -->
      <v-icon @click="deleteService">mdi-delete</v-icon>
    </v-card-title>
    <!-- Display Service Description -->
    <v-card-subtitle>{{ service.description }}</v-card-subtitle>
    <v-card-text>
      <!-- Display Service Price -->
      <strong>Price:</strong> ${{ service.price }} <br />
      <!-- Display Available Slots -->
      <strong>Available Slots:</strong>
      <div v-for="slot in service.availability" :key="slot.day">
        {{ dayOfWeek[slot.dayOfWeek] }}: {{ slot.startTime }} ~
        {{ slot.endTime }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
/**
 * Define properties for the service card component.
 * The 'service' prop is an object containing service details.
 */
const props = defineProps({
  service: {
    type: Object,
    default: () => ({ availability: [] })
  }
});

/**
 * Define custom events 'edit' and 'delete' for the service card component.
 */
const emit = defineEmits(['edit', 'delete']);

/**
 * Emit an 'edit' event with the service data when the edit icon is clicked.
 */
const editService = () => {
  emit('edit', props.service);
};

/**
 * Emit a 'delete' event with the service data when the delete icon is clicked.
 */
const deleteService = () => {
  emit('delete', props.service);
};

/**
 * Map days of the week to a human-readable format.
 */
const dayOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];
</script>

<style scoped>
/* Scoped styles for the component */
.v-card-title {
  display: flex;
  align-items: center;
}
</style>

<template>
  <v-card class="mx-auto my-4">
    <v-card-title>
      <span>{{ service.title }}</span>
      <v-spacer></v-spacer>
      <v-icon @click="editService" class="mr-2">mdi-pencil</v-icon>
      <v-icon @click="deleteService">mdi-delete</v-icon>
    </v-card-title>
    <v-card-subtitle>{{ service.description }}</v-card-subtitle>
    <v-card-text>
      <strong>Price:</strong> ${{ service.price }} <br />
      <strong>Available Slots:</strong>
      <div v-for="slot in service.availability" :key="slot.day">
        {{ dayOfWeek[slot.dayOfWeek] }}: {{ slot.startTime }} ~ {{ slot.endTime }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  service: {
    type: Object,
    default: () => ({ availability: [] })
  }
});

const emit = defineEmits(['edit', 'delete']);

const editService = () => {
  emit('edit', props.service);
};

const deleteService = () => {
  emit('delete', props.service);
};

// Map days of the week to human-readable format
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
.v-card-title {
  display: flex;
  align-items: center;
}
</style>

<!-- 
Dialog component for creating and editing bookings
External library: Vuetify (https://vuetifyjs.com/)
-->
<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{
          isEditMode ? 'Edit Booking' : 'Create Booking'
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <!-- Disabled field for displaying Service ID -->
          <v-text-field
            disabled
            v-model="booking.service.id"
            label="Service ID"
            :rules="[(v) => !!v || 'Service ID is required']"
          ></v-text-field>
          <!-- Disabled field for displaying Customer ID -->
          <v-text-field
            disabled
            v-model="booking.customer.id"
            label="Customer ID"
            :rules="[(v) => !!v || 'Customer ID is required']"
          ></v-text-field>
          <!-- Field for inputting date of the booking -->
          <v-text-field
            v-model="booking.date"
            label="Date"
            :rules="[(v) => !!v || 'Date is required']"
          ></v-text-field>
          <!-- Field for inputting start time of the booking -->
          <v-text-field
            v-model="booking.startTime"
            label="Start Time"
            :rules="[(v) => !!v || 'Start Time is required']"
          ></v-text-field>
          <!-- Field for inputting end time of the booking -->
          <v-text-field
            v-model="booking.endTime"
            label="End Time"
            :rules="[(v) => !!v || 'End Time is required']"
          ></v-text-field>
          <!-- Dropdown for selecting the status of the booking -->
          <v-select
            v-model="booking.status"
            :items="['pending', 'confirmed', 'cancelled']"
            label="Status"
            :rules="[(v) => !!v || 'Status is required']"
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- Button to close the dialog -->
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <!-- Button to save the booking details -->
        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
// Importing necessary modules from Vue
const props = defineProps({
  modelValue: Boolean, // Boolean prop to control dialog visibility
  booking: Object, // Object prop to hold booking details
  isEditMode: Boolean // Boolean prop to determine if editing or creating
});
const emit = defineEmits(['update:modelValue', 'submit']); // Emitting events for parent component

// Defining reactive state variables
const dialog = ref(false);
const form = ref(null);
const formValid = ref(false);
const booking = ref({ ...props.booking });

// Watch for changes in modelValue prop to update dialog visibility and booking data
watch(
  () => props.modelValue,
  (newVal) => {
    dialog.value = newVal;
    if (newVal) {
      booking.value = { ...props.booking };
    }
  }
);

// Function to close the dialog
const close = () => {
  dialog.value = false;
  emit('update:modelValue', false);
};

// Function to save booking details
const save = () => {
  if (form.value.validate()) {
    dialog.value = false;
    emit('update:modelValue', false);
    emit('submit', booking.value);
  }
};
</script>

<style scoped>
/* Scoped styles for the component */
</style>

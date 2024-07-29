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
          <!-- Disabled field for displaying Service Name -->
          <v-text-field
            disabled
            v-model="booking.service.name"
            label="Service"
            :rules="[(v) => !!v || 'Service is required']"
          ></v-text-field>
          <!-- Field for displaying Customer Name -->
          <v-text-field
            v-model="booking.customerName"
            label="Customer Name"
            :rules="[(v) => !!v || 'Customer Name is required']"
          ></v-text-field>
          <!-- Field for displaying Customer Email -->
          <v-text-field
            v-model="booking.customerEmail"
            label="Customer Email"
            :rules="[(v) => !!v || 'Customer Email is required']"
          ></v-text-field>
          <!-- Field for displaying Customer Phone -->
          <v-text-field
            v-model="booking.customerPhonenumber"
            label="Customer Phone"
            :rules="[(v) => !!v || 'Customer Phone is required']"
          ></v-text-field>
          <!-- Field for inputting price of the booking -->
          <v-text-field
            v-model="booking.price"
            label="Price"
            :rules="[(v) => !!v || 'Price is required']"
          ></v-text-field>
          <!-- Field for inputting date of the booking using plain text -->
          <v-text-field
            v-model="formattedDate"
            label="Date (yyyy-mm-dd)"
            :rules="[
              (v) => !!v || 'Date is required',
              (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Invalid date format'
            ]"
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
import { defineProps, defineEmits } from 'vue';

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
const formattedDate = ref('');

// Watch for changes in modelValue prop to update dialog visibility and booking data
watch(
  () => props.modelValue,
  (newVal) => {
    dialog.value = newVal;
    if (newVal) {
      booking.value = { ...props.booking };
      formattedDate.value = booking.value.date
        ? new Date(booking.value.date).toISOString().substr(0, 10)
        : '';
    }
  }
);

// Watch for changes in formattedDate to update booking date
watch(
  () => formattedDate.value,
  (newVal) => {
    if (newVal) {
      booking.value.date = new Date(newVal).toISOString();
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

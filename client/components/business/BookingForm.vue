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
          <v-text-field
            disabled
            v-model="booking.service.id"
            label="Service ID"
            :rules="[(v) => !!v || 'Service ID is required']"
          ></v-text-field>
          <v-text-field
            disabled
            v-model="booking.customer.id"
            label="Customer ID"
            :rules="[(v) => !!v || 'Customer ID is required']"
          ></v-text-field>
          <v-text-field
            v-model="booking.date"
            label="Date"
            :rules="[(v) => !!v || 'Date is required']"
          ></v-text-field>
          <v-text-field
            v-model="booking.startTime"
            label="Start Time"
            :rules="[(v) => !!v || 'Start Time is required']"
          ></v-text-field>
          <v-text-field
            v-model="booking.endTime"
            label="End Time"
            :rules="[(v) => !!v || 'End Time is required']"
          ></v-text-field>
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
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  modelValue: Boolean,
  booking: Object,
  isEditMode: Boolean
});
const emit = defineEmits(['update:modelValue', 'submit']);

const dialog = ref(false);
const form = ref(null);
const formValid = ref(false);
const booking = ref({ ...props.booking });

watch(
  () => props.modelValue,
  (newVal) => {
    dialog.value = newVal;
    if (newVal) {
      booking.value = { ...props.booking };
    }
  }
);

const close = () => {
  dialog.value = false;
  emit('update:modelValue', false);
};

const save = () => {
  if (form.value.validate()) {
    dialog.value = false;
    emit('update:modelValue', false);
    emit('submit', booking.value);
  }
};
</script>

<style scoped>
/* Add necessary styling */
</style>

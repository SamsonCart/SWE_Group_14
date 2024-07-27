<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="handleCreate">Create New Booking</v-btn>
        <v-data-table
          :headers="headers"
          :items="businessStore.bookings"
          item-value="_id"
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="statusColor(item.status)">
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="handleEdit(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="handleDelete(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <BookingForm
      v-model="formDialog"
      :booking="selectedBooking"
      :isEditMode="isEditMode"
      @submit="submitForm"
    ></BookingForm>
    <v-dialog v-model="confirmDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this booking?</v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="confirmDelete">Confirm</v-btn>
          <v-btn color="secondary" text @click="cancelDelete">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBusinessStore } from '@/store';
import BookingForm from '@/components/business/BookingForm.vue';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
});

const businessStore = useBusinessStore();

onMounted(async () => {
  if (!businessStore.bookings.length) {
    await businessStore.getServiceBookings();
  }
});

const headers = [
  { title: 'Service', value: 'service.name' },
  { title: 'Customer', value: 'customer.email' },
  { title: 'Date', value: 'date' },
  { title: 'Start Time', value: 'startTime' },
  { title: 'End Time', value: 'endTime' },
  { title: 'Status', value: 'status' },
  { title: 'Actions', value: 'actions', sortable: false }
];

const formDialog = ref(false);
const confirmDeleteDialog = ref(false);
const selectedBooking = ref(null);
const isEditMode = ref(false);

const handleCreate = () => {
  selectedBooking.value = {};
  isEditMode.value = false;
  formDialog.value = true;
};

const handleEdit = (booking) => {
  selectedBooking.value = { ...booking };
  isEditMode.value = true;
  formDialog.value = true;
};

const handleDelete = (booking) => {
  selectedBooking.value = booking;
  confirmDeleteDialog.value = true;
};

const confirmDelete = async () => {
  await businessStore.deleteBooking(selectedBooking.value._id);
  await businessStore.getServiceBookings();
  confirmDeleteDialog.value = false;
};

const cancelDelete = () => {
  confirmDeleteDialog.value = false;
};

const submitForm = async (booking) => {
  if (isEditMode.value) {
    const bookingId = selectedBooking.value._id;
    const bookingData = {
      status: booking.status,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      serviceId: booking.service.id,
      customerId: booking.customer.id
    };
    await businessStore.updateBooking(bookingId, bookingData);
  } else {
    await businessStore.createBooking(booking);
  }
  formDialog.value = false;
};

const statusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'confirmed':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return '';
  }
};
</script>

<style scoped>
/* Add necessary styling */
</style>

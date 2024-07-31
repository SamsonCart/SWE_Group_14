<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <!-- Data table to display bookings -->
        <v-data-table
          :headers="headers"
          :items="businessStore.bookings"
          item-value="_id"
        >
          <!-- Custom header slot to group customer and business fields -->
          <template v-slot:header="{ header }">
            <tr>
              <th
                v-for="(col, index) in headers"
                :key="index"
                :colspan="col.colspan || 1"
                :rowspan="col.rowspan || 1"
              >
                {{ col.title }}
              </th>
            </tr>
            <tr>
              <th v-for="(col, index) in headers" :key="index">
                <span v-if="col.group">{{ col.group }}</span>
              </th>
            </tr>
          </template>

          <!-- Slot for custom status chip with color based on booking status -->
          <template v-slot:item.status="{ item }">
            <v-chip :color="statusColor(item.status)">
              {{ item.status }}
            </v-chip>
          </template>

          <!-- Slot for action buttons (edit and delete) -->
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

    <!-- Booking form dialog component -->
    <BookingForm
      v-model="formDialog"
      :booking="selectedBooking"
      :isEditMode="isEditMode"
      @submit="submitForm"
    ></BookingForm>

    <!-- Confirmation dialog for booking deletion -->
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
import { onMounted, ref } from 'vue';
import { useBusinessStore } from '@/store'; // Import the store for managing business-related data
import BookingForm from '@/components/business/BookingForm.vue'; // Import the booking form component

// Define metadata for the page layout
definePageMeta({
  layout: 'dashboard'
});

const businessStore = useBusinessStore(); // Initialize the business store

// Define headers for the data table
const headers = [
  { title: 'Service', value: 'service.name' },
  {
    title: 'Customer Info',
    group: 'Customer',
    value: 'customerName'
  },
  {
    title: 'Customer Info',
    group: 'Customer',
    value: 'customerEmail'
  },
  {
    title: 'Customer Info',
    group: 'Phone',
    value: 'customerPhonenumber'
  },
  {
    title: 'Business Info',
    group: 'Business Name',
    value: 'business.name'
  },
  {
    title: 'Business Info',
    group: 'Business Email',
    value: 'business.email'
  },
  {
    title: 'Business Info',
    group: 'Business Phone',
    value: 'business.phonenumber'
  },
  {
    title: 'Date',
    key: 'date',
    value: (item) => {
      console.log('item :>> ', item);
      return new Date(item.date).toISOString().substr(0, 10);
    }
  },
  { title: 'Start Time', value: 'startTime' },
  { title: 'End Time', value: 'endTime' },
  { title: 'Status', value: 'status' },
  { title: 'Actions', value: 'actions', sortable: false }
];

const formDialog = ref(false); // Reactive variable to control the visibility of the form dialog
const confirmDeleteDialog = ref(false); // Reactive variable to control the visibility of the delete confirmation dialog
const selectedBooking = ref(null); // Reactive variable to store the selected booking
const isEditMode = ref(false); // Reactive variable to determine if the form is in edit mode

onMounted(async () => {
  if (businessStore.business?._id) {
    await businessStore.getServiceBookings();
  }
});

// Handle the editing of an existing booking
const handleEdit = (booking) => {
  selectedBooking.value = { ...booking }; // Set the selected booking
  isEditMode.value = true; // Set edit mode to true
  formDialog.value = true; // Show the form dialog
};

// Handle the deletion of a booking
const handleDelete = (booking) => {
  selectedBooking.value = booking; // Set the selected booking
  confirmDeleteDialog.value = true; // Show the delete confirmation dialog
};

// Confirm the deletion of a booking
const confirmDelete = async () => {
  await businessStore.deleteBooking(selectedBooking.value._id); // Delete the booking
  await businessStore.getServiceBookings(); // Refresh the list of bookings
  confirmDeleteDialog.value = false; // Hide the delete confirmation dialog
};

// Cancel the deletion of a booking
const cancelDelete = () => {
  confirmDeleteDialog.value = false; // Hide the delete confirmation dialog
};

// Submit the booking form (create or update a booking)
const submitForm = async (booking) => {
  if (isEditMode.value) {
    // If in edit mode, update the booking
    const bookingId = selectedBooking.value._id;
    const bookingData = {
      status: booking.status,
      date: booking.date,
      price: booking.price,
      startTime: booking.startTime,
      endTime: booking.endTime,
      serviceId: booking.service.id,
      customerId: booking.customer.id,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhonenumber: booking.customerPhonenumber
    };
    await businessStore.updateBooking(bookingId, bookingData);
  } else {
    // If not in edit mode, create a new booking
    await businessStore.createBooking(booking);
  }
  formDialog.value = false; // Hide the form dialog
};

// Determine the color of the status chip based on the booking status
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

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <!-- Data table to display inquiries -->
        <v-data-table
          :headers="headers"
          :items="businessStore.inquiries"
          item-value="_id"
        >
          <!-- Custom header slot -->
          <template v-slot:header="{ header }">
            <tr>
              <th v-for="(col, index) in headers" :key="index">
                {{ col.title }}
              </th>
            </tr>
          </template>

          <!-- Slot for action button (respond/edit) -->
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="handleResponse(item)">
              <v-icon>{{
                !!item.response ? 'mdi-pencil' : 'mdi-reply'
              }}</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Response form dialog component -->
    <v-dialog v-model="responseDialog" max-width="500px">
      <v-card>
        <v-card-title>Respond to Inquiry</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="responseText"
            label="Response"
            rows="3"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="submitResponse">Submit</v-btn>
          <v-btn color="secondary" @click="responseDialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { useBusinessStore } from '@/store/business';

// Define metadata for the page layout
definePageMeta({
  layout: 'dashboard'
});

const businessStore = useBusinessStore();
const headers = [
  {
    title: 'Customer Name',
    key: 'fullname',
    value: (item) => customerName(item.customer)
  },
  { title: 'Email', value: 'customer.email' },
  { title: 'Inquiry', value: 'content' },
  { title: 'Response', value: 'response.content' },
  { title: 'Actions', value: 'actions', sortable: false }
];

const responseDialog = ref(false);
const responseText = ref('');
const selectedInquiry = ref(null);

// Fetch inquiries when component is mounted
onMounted(async () => {
  const businessId = businessStore.business?._id;
  if (businessId) {
    await businessStore.getInquiries(businessId);
  }
});

// Handle response button click
const handleResponse = (inquiry) => {
  selectedInquiry.value = inquiry;
  responseText.value = inquiry.response?.content || '';
  responseDialog.value = true;
};

// Submit response to the server
const submitResponse = async () => {
  await businessStore.respondToInquiry(
    selectedInquiry.value._id,
    responseText.value
  );
  responseDialog.value = false;
};

// Get customer's full name or email if name is not available
const customerName = (customer) => {
  return customer.firstname && customer.lastname
    ? `${customer.firstname} ${customer.lastname}`
    : customer.email;
};
</script>

<style scoped>
/* Add necessary styling */
</style>

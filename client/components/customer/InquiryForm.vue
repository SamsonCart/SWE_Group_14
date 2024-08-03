<!-- components/customer/InquiryForm.vue -->
<template>
  <v-card>
    <v-card-title>Submit an Inquiry</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-textarea
          v-model="content"
          label="Your Inquiry"
          :rules="[(v) => !!v || 'Inquiry is required']"
          required
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="submitInquiry">Submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useUserStore, useNotificationStore } from '@/store';

// Define base URL and props
const baseUrl = import.meta.env.VITE_API_ENDPOINT;
const props = defineProps({ businessId: String });
const emit = defineEmits(['inquirySubmitted']);

const userStore = useUserStore();
const notificationStore = useNotificationStore();

const valid = ref(false);
const content = ref('');
const form = ref(null);

// Submit inquiry to the server
const submitInquiry = async () => {
  if (form.value) {
    form.value.validate(); // Validate the form
    if (valid.value) {
      const payload = {
        content: content.value,
        customer: userStore.user.id,
        business: props.businessId
      };

      try {
        await $fetch(`${baseUrl}/inquiry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        });
        notificationStore.showSuccess('Inquiry submitted successfully');
        content.value = ''; // Clear the form content
        emit('inquirySubmitted'); // Emit an event indicating successful submission
        form.value.reset(); // Reset form validation status
      } catch (error) {
        notificationStore.showError(error.message); // Show error message
      }
    }
  }
};
</script>

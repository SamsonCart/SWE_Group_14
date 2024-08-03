<!-- components/customer/ReviewForm.vue -->
<template>
  <v-dialog v-model="showLocal" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{
          editMode ? 'Edit Review' : 'Write a Review'
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-rating
            v-model="rating"
            :rules="[(v) => !!v || 'Rating is required']"
            required
          ></v-rating>
          <v-textarea
            v-model="comment"
            label="Comment"
            :rules="[(v) => !!v || 'Comment is required']"
            required
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeForm">Cancel</v-btn>
        <v-btn color="blue darken-1" text :disabled="!valid" @click="submit">{{
          editMode ? 'Update' : 'Submit'
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useUserStore, useNotificationStore } from '@/store';
const baseUrl = import.meta.env.VITE_API_ENDPOINT;

const props = defineProps({
  show: Boolean,
  editMode: Boolean,
  review: Object,
  businessId: String
});

const emit = defineEmits(['update:show', 'reviewSubmitted']);

const notificationStore = useNotificationStore();
const userStore = useUserStore();

const showLocal = ref(props.show);
const valid = ref(false);
const rating = ref(props.review ? props.review.rating : 0);
const comment = ref(props.review ? props.review.comment : '');

watch(
  () => props.show,
  (newValue) => {
    showLocal.value = newValue;
  }
);

watch(showLocal, (newValue) => {
  emit('update:show', newValue);
});

watch(
  () => props.review,
  (newReview) => {
    if (newReview) {
      rating.value = newReview.rating;
      comment.value = newReview.comment;
    } else {
      rating.value = 0;
      comment.value = '';
    }
  }
);

const closeForm = () => {
  showLocal.value = false;
};

const form = ref(null);

const submit = async () => {
  if (form.value) {
    form.value.validate();
    if (valid.value) {
      const url = props.editMode
        ? `${baseUrl}/review/${props.review._id}`
        : `${baseUrl}/review`;

      const method = props.editMode ? 'PUT' : 'POST';
      const payload = {
        rating: rating.value,
        comment: comment.value,
        business: props.businessId,
        customer: userStore.user.id
      };

      try {
        const response = await $fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: payload
        });

        notificationStore.showSuccess('Review submitted successfully');
        emit('reviewSubmitted');
        closeForm();
      } catch (error) {
        notificationStore.showError(error.message);
      }
    }
  }
};
</script>

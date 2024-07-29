<template>
  <!-- Dialog for creating or editing a service -->
  <v-dialog v-model="isDialogOpen" max-width="600px">
    <v-card>
      <!-- Title of the card changes based on whether it's edit mode or create mode -->
      <v-card-title>
        {{ isEditMode ? 'Edit Service' : 'Create Service' }}
      </v-card-title>
      <v-card-text>
        <!-- Form to submit service details -->
        <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid">
          <!-- Title input field -->
          <v-text-field
            v-model="service.title"
            label="Title"
            required
            :rules="[(v) => !!v || 'Title is required']"
          ></v-text-field>
          <!-- Description input field -->
          <v-textarea
            v-model="service.description"
            label="Description"
            required
            :rules="[(v) => !!v || 'Description is required']"
          ></v-textarea>
          <!-- Price input field -->
          <v-text-field
            v-model="service.price"
            label="Price"
            type="number"
            required
            :rules="[(v) => !!v || 'Price is required']"
          ></v-text-field>

          <!-- Divider for separation -->
          <v-divider class="my-4"></v-divider>

          <!-- Subheader for availability section -->
          <v-subheader>Availability</v-subheader>
          <v-container fluid>
            <v-row>
              <!-- Loop through the availability array and create a card for each entry -->
              <v-col
                v-for="(entry, index) in service.availability"
                :key="index"
                cols="12"
                lg="6"
              >
                <v-card class="pa-3 mb-2" outlined>
                  <v-row>
                    <v-col cols="12">
                      <!-- Day of the Week select field -->
                      <v-select
                        v-model="entry.dayOfWeek"
                        :items="daysOfWeek"
                        item-title="text"
                        item-value="value"
                        label="Day of the Week"
                        required
                      ></v-select>
                      <!-- Start Time input field -->
                      <v-text-field
                        v-model="entry.startTime"
                        label="Start Time"
                        type="time"
                        required
                        class="mt-2"
                      ></v-text-field>
                      <!-- End Time input field -->
                      <v-text-field
                        v-model="entry.endTime"
                        label="End Time"
                        type="time"
                        required
                        class="mt-2"
                      ></v-text-field>
                      <!-- Session Duration input field -->
                      <v-text-field
                        v-model="entry.sessionDuration"
                        label="Session Duration (minutes)"
                        type="number"
                        required
                        class="mt-2"
                      ></v-text-field>
                    </v-col>
                    <!-- Delete icon to remove an availability entry -->
                    <v-col class="d-flex align-end justify-end">
                      <v-icon
                        @click="removeAvailability(index)"
                        class="ml-2"
                        color="red"
                      >
                        mdi-delete
                      </v-icon>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <!-- Button to add a new time slot -->
          <v-btn @click="addAvailability" color="primary" class="mt-2">
            Add Time Slot
          </v-btn>

          <!-- Card actions with Save/Create and Cancel buttons -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" :disabled="!isFormValid">
              {{ isEditMode ? 'Save' : 'Create' }}
            </v-btn>
            <v-btn color="secondary" @click="closeForm">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
// Define props that the component accepts
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  service: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      price: '',
      availability: []
    })
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
});

// Define emits to communicate with the parent component
const emit = defineEmits(['update:modelValue', 'submit']);

// Reactive reference for dialog open state
const isDialogOpen = ref(props.modelValue);

// Reactive reference for form validation
const isFormValid = ref(false);

// Watch for changes in modelValue prop to update isDialogOpen
watch(
  () => props.modelValue,
  (newVal) => {
    isDialogOpen.value = newVal;
  }
);

// Array for day of the week options
const daysOfWeek = [
  { text: 'Monday', value: 0 },
  { text: 'Tuesday', value: 1 },
  { text: 'Wednesday', value: 2 },
  { text: 'Thursday', value: 3 },
  { text: 'Friday', value: 4 },
  { text: 'Saturday', value: 5 },
  { text: 'Sunday', value: 6 }
];

// Function to close the form and emit an event
const closeForm = () => {
  emit('update:modelValue', false);
};

// Function to submit the form and emit the submit event
const submitForm = () => {
  if (isFormValid.value) {
    emit('submit', props.service);
    closeForm();
  }
};

// Function to add a new availability entry
const addAvailability = () => {
  if (props.service.availability.length < 7) {
    props.service.availability.push({
      dayOfWeek: 0,
      startTime: '09:00',
      endTime: '18:00',
      sessionDuration: 60
    });
  }
};

// Function to remove an availability entry by index
const removeAvailability = (index) => {
  props.service.availability.splice(index, 1);
};
</script>

<style scoped>
/* Add any necessary styling here */
</style>

<template>
  <v-dialog v-model="isDialogOpen" max-width="600px">
    <v-card>
      <v-card-title>
        {{ isEditMode ? 'Edit Service' : 'Create Service' }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="service.title"
            label="Title"
            required
          ></v-text-field>
          <v-textarea
            v-model="service.description"
            label="Description"
            required
          ></v-textarea>
          <v-text-field
            v-model="service.price"
            label="Price"
            type="number"
            required
          ></v-text-field>

          <v-divider class="my-4"></v-divider>

          <v-subheader>Availability</v-subheader>
          <v-container fluid>
            <v-row>
              <v-col
                v-for="(entry, index) in service.availability"
                :key="index"
                cols="12"
                lg="6"
              >
                <v-card class="pa-3 mb-2" outlined>
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="entry.dayOfWeek"
                        :items="[0, 1, 2, 3, 4, 5, 6]"
                        label="Day of the Week"
                        required
                      ></v-select>
                      <v-text-field
                        v-model="entry.startTime"
                        label="Start Time"
                        type="time"
                        required
                        class="mt-2"
                      ></v-text-field>
                      <v-text-field
                        v-model="entry.endTime"
                        label="End Time"
                        type="time"
                        required
                        class="mt-2"
                      ></v-text-field>
                      <v-text-field
                        v-model="entry.sessionDuration"
                        label="Session Duration (minutes)"
                        type="number"
                        required
                        class="mt-2"
                      ></v-text-field>
                    </v-col>
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

          <v-btn @click="addAvailability" color="primary" class="mt-2">
            Add Time Slot
          </v-btn>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit">{{
              isEditMode ? 'Save' : 'Create'
            }}</v-btn>
            <v-btn color="secondary" @click="closeForm">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
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

const emit = defineEmits(['update:modelValue', 'submit']);

const isDialogOpen = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    isDialogOpen.value = newVal;
  }
);

const daysOfWeek = [
  { text: 'Monday', value: 0 },
  { text: 'Tuesday', value: 1 },
  { text: 'Wednesday', value: 2 },
  { text: 'Thursday', value: 3 },
  { text: 'Friday', value: 4 },
  { text: 'Saturday', value: 5 },
  { text: 'Sunday', value: 6 }
];

const closeForm = () => {
  emit('update:modelValue', false);
};

const submitForm = () => {
  emit('submit', props.service);
  closeForm();
};

const addAvailability = () => {
  if (props.service.availability.length < 7) {
    props.service.availability.push({
      dayOfWeek: 0,
      startTime: '09:00',
      endTime: '18:00',
      sessionDuration: 40
    });
  }
};

const removeAvailability = (index) => {
  props.service.availability.splice(index, 1);
};
</script>

<style scoped>
/* Add any necessary styling here */
</style>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  searchRadius: Number,
  serviceType: String
});
const emit = defineEmits(['search']);

const onSubmit = () => {
  emit('search');
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>Find Local Services</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="onSubmit">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="props.searchRadius"
                  label="Search Radius (miles)"
                  type="number"
                  max="20"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <!-- <v-select
                  v-model="props.serviceType"
                  :items="[
                    'All Services',
                    'Plumber',
                    'Makeup Artist',
                    'AC Repair'
                  ]"
                  label="Service Type"
                ></v-select> -->
                <!-- <v-select
                  v-model="props.serviceType"
                  :items="[
                    { text: 'All Services', value: '' },
                    { text: 'Plumber', value: 'plumber' },
                    { text: 'Makeup Artist', value: 'makeup' },
                    { text: 'AC Repair', value: 'ac' }
                    // Add more service types as needed
                  ]"
                  item-title="text"
                  item-value="value"
                  label="Service Type"
                ></v-select> -->
              </v-col>
              <v-col cols="12">
                <v-btn type="submit" color="primary">Search</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

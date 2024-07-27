<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>{{ business?.businessName }}</v-card-title>
          <v-card-subtitle>{{ business?.description }}</v-card-subtitle>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Contact</v-list-item-title>
                  <v-list-item-subtitle>
                    <div>Phone: {{ business?.phoneNumber }}</div>
                    <div>Email: {{ business?.email }}</div>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Address</v-list-item-title>
                  <v-list-item-subtitle>
                    <div>
                      {{ business?.address.city }},
                      {{ business?.address.state }},
                      {{ business?.address.country }}
                    </div>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-row v-if="services?.length">
              <v-col
                class="p"
                cols="6"
                v-for="service in services"
                :key="service._id"
              >
                <ServiceCard :service="service" />
              </v-col>
            </v-row>
            <v-alert v-else type="info">
              No services found. Try adjusting your search criteria.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
    </v-row>
  </v-container>
</template>

<script setup>
import ServiceCard from '@/components/customer/ServiceCard.vue';

import { useUserStore, useNotificationStore } from '@/store';

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const baseUrl = import.meta.env.VITE_API_ENDPOINT;

const props = defineProps({
  business: Object,
  services: Array
});


</script>

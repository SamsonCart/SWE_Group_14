<!-- Template for displaying detailed business and service information -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-container>
          <v-card class="mb-4">
            <v-card-title>
              <v-btn text @click="goToBusinessDetail(business._id)">
                {{ business.businessName }}
              </v-btn>
            </v-card-title>
            <v-card-subtitle>{{ business.description }}</v-card-subtitle>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Contact</v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="contact-info">
                        <v-icon left>mdi-phone</v-icon>
                        {{ business.phoneNumber }}
                        <v-icon left>mdi-email</v-icon> {{ business.email }}
                      </div>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Address</v-list-item-title>
                    <v-list-item-subtitle>
                      <div>
                        {{ business.address.city }},
                        {{ business.address.state }},
                        {{ business.address.country }}
                      </div>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-carousel>
                <v-carousel-item
                  v-for="(img, index) in business.images"
                  :key="index"
                  :src="`${baseUrl}/uploads/images/${img}`"
                  aspect-ratio="3/4"
                  class="carousel-item"
                ></v-carousel-item>
              </v-carousel>
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
            </v-card-text>
          </v-card>
        </v-container>
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
  services: Array,
});
</script>

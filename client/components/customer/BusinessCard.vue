<!-- Component for displaying business details -->
<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-btn text @click="goToBusinessDetail(business._id)">
          {{ business.name }}
        </v-btn>
      </v-card-title>
      <v-card-subtitle>{{ business.description }}</v-card-subtitle>
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Contact</v-list-item-title>
              <v-list-item-subtitle>
                <div>
                  Phone: {{ business.phonenumber }} Email: {{ business.email }}
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Address</v-list-item-title>
              <v-list-item-subtitle>
                <div>
                  {{ business.address.city }}, {{ business.address.state }},
                  {{ business.address.country }}
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-row>
              <v-col
                v-for="(img, index) in business.images"
                :key="index"
                cols="6"
                sm="4"
                md="3"
              >
                <v-img
                  :src="`${baseUrl}/uploads/images/${img}`"
                  aspect-ratio="3/4"
                  class="pa-2"
                  alt="Business Image"
                ></v-img>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<!-- Script to handle business details component logic -->
<script setup>
const props = defineProps({
  business: Object // Defining props with business as an object
});

const baseUrl = import.meta.env.VITE_API_ENDPOINT; // Base URL for API endpoint from environment variables

const router = useRouter(); // Using the Vue router
const goToBusinessDetail = (id) => {
  router.push(`/business/${id}`); // Navigating to business detail page
};
</script>

<style scoped>
.pa-2 {
  padding: 8px; /* Padding for business images */
}
</style>

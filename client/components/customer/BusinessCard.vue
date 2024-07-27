<template>
  <v-card>
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
              <div>Phone: {{ business.phoneNumber }}</div>
              <div>Email: {{ business.email }}</div>
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
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  business: Object
});

const router = useRouter();
const goToBusinessDetail = (id) => {
  router.push(`/business/${id}`);
};
</script>

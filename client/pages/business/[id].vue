<!-- pages/business/[id].vue -->
<template>
  <BusinessInfo v-if="business" :business="business" />
</template>

<script setup>
import BusinessInfo from '@/components/customer/BusinessInfo.vue';

const baseUrl = import.meta.env.VITE_API_ENDPOINT;

const route = useRoute();

const business = ref(null);

const fetchBusinessDetails = async (id) => {
  try {
    const response = await $fetch(`${baseUrl}/business/${id}`);
    business.value = response.data;
  } catch (error) {
    console.error('Error fetching business details:', error);
  }
};

onMounted(() => {
  const { id } = route.params;
  fetchBusinessDetails(id);
});
</script>

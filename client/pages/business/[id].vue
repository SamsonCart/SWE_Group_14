<template>
  <BusinessInfo :business="business" :services="services"/>
</template>

<script setup>
import BusinessInfo from '@/components/customer/BusinessInfo.vue';

const baseUrl = import.meta.env.VITE_API_ENDPOINT;

const route = useRoute();
console.log('route.params.id', route.params.id);

const business = ref(null);
const services = ref([]);


const fetchBusinessDetails = async (id) => {
  try {
    const response = await $fetch(`${baseUrl}/business/${id}`);
    console.log('fetchBusinessDetails :>> ', response);
    business.value = response.data;
  } catch (error) {
    console.error('Error fetching business details:', error);
  }
};

const fetchBusinessServices = async (id) => {
  try {
    const response = await $fetch(`${baseUrl}/service`, {
      params: { businessId: id }
    });
    console.log('fetchBusinessServices :>> ', response);
    services.value = response.data;
  } catch (error) {
    console.error('Error fetching business details:', error);
  }
};

onMounted(() => {
  const { id } = route.params;
  fetchBusinessDetails(id);
  fetchBusinessServices(id);
});
</script>

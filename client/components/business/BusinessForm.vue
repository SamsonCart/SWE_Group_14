<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field
      v-model="form.businessName"
      label="Business Name"
      required
    ></v-text-field>
    <v-text-field v-model="form.description" label="Description"></v-text-field>
    <v-text-field v-model="form.address.street" label="Street"></v-text-field>
    <v-text-field v-model="form.address.city" label="City"></v-text-field>
    <v-text-field v-model="form.address.state" label="State"></v-text-field>
    <v-text-field
      v-model="form.address.zipCode"
      label="Zip Code"
    ></v-text-field>
    <v-text-field
      v-model="form.phoneNumber"
      label="Phone Number"
    ></v-text-field>
    <v-text-field v-model="form.email" label="Email" required></v-text-field>
    <v-btn type="submit" :disabled="!isChanged" color="primary"> Save </v-btn>
    <!-- <v-btn type="button" @click="resetForm" color="secondary"> Reset </v-btn> -->
  </v-form>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useBusinessStore, useUserStore } from '@/store';

const props = defineProps({
  business: {
    type: Object,
    default: () => ({})
  }
});

const businessStore = useBusinessStore();
const userStore = useUserStore();

const initialForm = reactive({
  businessName: '',
  description: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: ''
  },
  phoneNumber: '',
  email: ''
});

const form = reactive({ ...initialForm });

const isEditing = ref(false);

const resetForm = () => {
  Object.assign(form, initialForm);
  if (isEditing.value) {
    Object.assign(form, businessStore.business);
  }
};

const isChanged = computed(() => {
  return (
    JSON.stringify(form) !==
    JSON.stringify(isEditing.value ? businessStore.business : initialForm)
  );
});

watch(
  () => businessStore.business,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      Object.assign(form, newVal);
      Object.assign(initialForm, newVal); // Keep initial form updated
      isEditing.value = true;
    } else {
      resetForm();
      isEditing.value = false;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await businessStore.getUserBusiness();
});

const handleSubmit = async () => {
  if (isEditing.value) {
    const businessId = form._id;
    const businessData = {
      businessName: form.businessName,
      description: form.description,
      address: {
        street: form.address.street,
        city: form.address.city,
        state: form.address.state,
        zipCode: form.address.zipCode
      },
      phoneNumber: form.phoneNumber,
      email: form.email,
      owner: form.owner
    };
    await businessStore.updateBusiness(businessId, businessData);
  } else {
    form.owner = userStore.user.id;
    await businessStore.createBusiness(form);
  }
  // Reset the initial form after submit
  Object.assign(initialForm, form);
};
</script>

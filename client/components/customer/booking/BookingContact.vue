<template>
  <div>
    <v-text-field v-model="customer.name" label="Name" />
    <v-text-field v-model="customer.email" label="Email" />
    <v-text-field v-model="customer.phonenumber" label="Phone Number" />

    <v-card-actions class="w-100 d-flex justify-content-end">
      <v-btn color="gray" @click="$emit('back')">Back</v-btn>
      <v-btn
        color="primary"
        :disabled="!isContactInfoComplete"
        @click="$emit('contact-info', customer)"
        >Next</v-btn
      >
    </v-card-actions>
  </div>
</template>

<script setup>
const props = defineProps({
  customer: Object
});
const emit = defineEmits(['contact-info', 'back']);

const customer = ref({ ...props.customer });

const isContactInfoComplete = computed(() => {
  return (
    customer.value.name && customer.value.email && customer.value.phonenumber
  );
});
</script>

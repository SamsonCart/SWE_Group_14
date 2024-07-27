<template>
  <v-form @submit.prevent="handleSubmit">
    <!-- Existing Fields -->
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
    <v-file-input
      v-model="tempFiles"
      label="Upload Images"
      multiple
      show-size
      @change="handleFileUpload"
    ></v-file-input>
    <div class="image-preview">
      <div v-for="(img, index) in images" :key="index" class="preview-item">
        <img :src="getImageUrl(img)" alt="preview" />
        <v-btn icon @click="removeImage(index)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    <v-btn type="submit" :disabled="!isChanged" color="primary">Save</v-btn>
  </v-form>
</template>

<script setup>
import { ref, reactive, onMounted, watch, defineProps } from 'vue';
import { useBusinessStore, useUserStore } from '@/store';
const baseUrl = import.meta.env.VITE_API_ENDPOINT;

const props = defineProps({
  business: {
    type: Object,
    default: () => null
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
  email: '',
  images: []
});

const form = reactive({ ...initialForm });
const tempFiles = ref([]);
const images = ref([]);
const isChanged = ref(false);

// On mount, load existing business data
onMounted(() => {
  if (props.business) {
    Object.assign(form, props.business);
    if (Array.isArray(props.business.images)) {
      images.value = [...props.business.images];
    }
  } else {
    watch(
      () => businessStore.business,
      (newBusiness) => {
        if (newBusiness && newBusiness._id) {
          Object.assign(form, newBusiness);
          if (Array.isArray(newBusiness.images)) {
            images.value = [...newBusiness.images];
          }
        }
      },
      { immediate: true }
    );
  }
});

const handleFileUpload = async () => {
  const formData = new FormData();
  tempFiles.value.forEach((file) => {
    formData.append('images', file);
  });

  const { data, error } = await useFetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: formData
  });

  if (data.value && data.value.filenames) {
    data.value.filenames.forEach((filename) => {
      images.value.push('temp/' + filename);
    });
    isChanged.value = true;
  }

  if (error.value) {
    console.error(error.value);
  }
};

const removeImage = (index) => {
  images.value.splice(index, 1);
  isChanged.value = true;
};

const getImageUrl = (img) => {
  return img.startsWith('temp/')
    ? `${baseUrl}uploads/temp/${img.replace('temp/', '')}`
    : `${baseUrl}uploads/images/${img}`;
};

const handleSubmit = async () => {
  if (props.business) {
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
      owner: form.owner,
      images: images.value
    };
    await businessStore.updateBusiness(props.business._id, businessData);
  } else {
    form.owner = userStore.user.id;
    form.images = images.value;
    await businessStore.createBusiness(form);
  }
};
</script>
<style scoped>
.image-preview {
  display: flex;
  flex-wrap: wrap;
}
.preview-item {
  position: relative;
  margin: 10px;
}
.preview-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.preview-item v-btn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>

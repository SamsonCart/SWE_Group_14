<template>
  <v-form @submit.prevent="handleSubmit">
    <!-- Text fields for business information -->
    <v-text-field
      v-model="form.name"
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
      v-model="form.phonenumber"
      label="Phone Number"
    ></v-text-field>
    <v-text-field v-model="form.email" label="Email" required></v-text-field>
    <!-- File input for uploading images with validation rules -->
    <v-file-input
      v-model="tempFiles"
      label="Upload Images"
      :rules="[fileCountRule, fileSizeRule]"
      multiple
      show-size
      @change="handleFileUpload"
    ></v-file-input>
    <!-- Preview uploaded images -->
    <div class="image-preview">
      <div v-for="(img, index) in images" :key="index" class="preview-item">
        <img :src="getImageUrl(img)" alt="preview" />
        <v-btn icon @click="removeImage(index)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    <!-- Submit button for the form -->
    <v-btn type="submit" :disabled="!isChanged || loading" color="primary">
      <span v-if="loading">Saving...</span>
      <span v-else>Save</span>
    </v-btn>
  </v-form>
</template>

<script setup>
import { useBusinessStore, useUserStore, useNotificationStore } from '@/store'; // Importing stores

const baseUrl = import.meta.env.VITE_API_ENDPOINT; // API endpoint from environment variable

// Props for the component
const props = defineProps({
  business: {
    type: Object,
    default: () => null
  }
});

// Defining stores
const businessStore = useBusinessStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

// Initial form data structure
const initialForm = reactive({
  name: '',
  description: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: ''
  },
  phonenumber: '',
  email: '',
  images: []
});

const form = reactive({ ...initialForm }); // Reactive form data
const tempFiles = ref([]); // Temporary files for upload
const images = ref([]); // Uploaded images
const isChanged = ref(false); // Flag to indicate form changes
const loading = ref(false); // Loading state

const user = computed(() => userStore.getUser); // Get current user from store

const maxFileCount = 10; // Maximum number of files
const maxFileSize = 5 * 1024 * 1024; // Maximum file size (5MB)

// On component mount, initialize form data
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

// Validation rule for file count
const fileCountRule = (files) => {
  if (files.length > maxFileCount) {
    return `You can only upload up to ${maxFileCount} files.`;
  }
  return true;
};

// Validation rule for file size
const fileSizeRule = (files) => {
  for (const file of files) {
    if (file.size > maxFileSize) {
      return `File ${file.name} is too large. Maximum size is ${
        maxFileSize / (1024 * 1024)
      }MB.`;
    }
  }
  return true;
};

// Handle file upload
const handleFileUpload = async () => {
  loading.value = true;
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
  loading.value = false;
};

// Remove image from preview
const removeImage = (index) => {
  images.value.splice(index, 1);
  isChanged.value = true;
};

// Get image URL for preview
const getImageUrl = (img) => {
  return img.startsWith('temp/')
    ? `${baseUrl}/uploads/temp/${img.replace('temp/', '')}`
    : `${baseUrl}/uploads/images/${img}`;
};

// Get coordinates from address using Nominatim API
const getCoordinates = async (address) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?street=${address.street}&city=${address.city}&state=${address.state}&format=json`
  );

  const data = await response.json();

  if (data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon)
    };
  }
  return null;
};

const handleSubmit = async () => {
  loading.value = true;
  const coordinates = await getCoordinates(form.address);

  if (!coordinates) {
    notificationStore.showError(
      'Unable to find coordinates for the provided address.'
    );
    loading.value = false;
    return;
  }

  const businessData = {
    name: form.name,
    description: form.description,
    address: {
      street: form.address.street,
      city: form.address.city,
      state: form.address.state,
      zipCode: form.address.zipCode,
      coordinates
    },
    phonenumber: form.phonenumber,
    email: form.email,
    owner: userStore.getUser.id,
    images: images.value
  };

  if (props.business) {
    await businessStore.updateBusiness(props.business._id, businessData);
  } else {
    await businessStore.createBusiness(businessData);
  }
  loading.value = false;
};

// Deep watch for changes in form data to set isChanged to true
watch(
  () => ({ ...form }),
  () => {
    isChanged.value = true;
  },
  { deep: true }
);

// Watch for changes in file input to set isChanged to true
watch(tempFiles, () => {
  isChanged.value = true;
});
</script>

<style scoped>
/* Scoped styles for the component */
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

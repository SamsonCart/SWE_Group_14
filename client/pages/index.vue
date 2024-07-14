<script setup>
import { storeToRefs } from 'pinia';
import { useHomepageStore } from '~/store/homepage';
import { TextIconNumber } from '@/components/box';
import Posts from '@/views/home/Posts';
import { nextTick } from 'vue';

const homepageStore = useHomepageStore();

const getStats = computed(() => homepageStore.getStats);

const boxData = computed(() =>
  Object.keys(getStats?.value).length === 0
    ? []
    : [
        {
          title: 'Hit',
          subTitle: 'Last week',
          value: getStats.value.postHits,
          percentage: -12,
          icon: 'star',
        },
        {
          title: 'User',
          subTitle: 'Last week',
          value: getStats.value.user,
          percentage: 98,
          icon: 'users',
        },
        {
          title: 'Post Category',
          subTitle: 'Last week',
          value: getStats.value.postCategory,
          percentage: -48,
          icon: 'folder',
        },
        {
          title: 'Post',
          subTitle: 'Last week',
          value: getStats.value.post,
          percentage: 22,
          icon: 'pencil',
        },
      ]
);
const services = [
  { value: '', label: 'What service do you need?' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical Services' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'cleaning', label: 'Housekeeping/Cleaning' },
  { value: 'landscaping', label: 'Lawn Care and Landscaping' },
  { value: 'pest-control', label: 'Pest Control' },
  { value: 'carpentry', label: 'Carpentry and Home Repairs' },
  { value: 'painting', label: 'Painting' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'appliance-repair', label: 'Appliance Repair' },
  { value: 'locksmith', label: 'Locksmith Services' },
  { value: 'moving', label: 'Moving Services' },
  { value: 'personal-training', label: 'Personal Training' },
  { value: 'tutoring', label: 'Tutoring' },
  { value: 'pet-grooming', label: 'Pet Grooming' },
  { value: 'car-mechanic', label: 'Car Mechanic' },
  { value: 'massage', label: 'Massage Therapy' },
  { value: 'photography', label: 'Photography' },
  { value: 'catering', label: 'Catering' },
  { value: 'computer-repair', label: 'Computer Repair' },
];

const selectedService = ref('');
const location = ref('');

const searchServices = () => {
  // Implement your search logic here
  console.log('Searching for:', selectedService.value, 'in', location.value);
};
onMounted(async () => {
  await nextTick(); // https://stackoverflow.com/questions/76527094/nuxt-3-and-vue-3-onmounted-call-function-usefetch-function-not-getting-data-form
  homepageStore.init();
});
</script>

<template>
  <!-- <div>
    <div class="row" v-if="getStats?.user">
      <div v-if="boxData.length > 0" class="col-md-3" v-for="box in boxData" :key="box.id">
        <TextIconNumber
          :title="box.title"
          :subTitle="box.subTitle"
          :number="box.value"
          :percentage="box.percentage"
          :icon="box?.icon"
        ></TextIconNumber>
      </div>
    </div>
    <utilsSkeleton v-else />

    <Posts :records="3" />
  </div> -->
  <main>
    <section id="hero">
      <h1>Find Local Services in Your Area</h1>
      <p>Connect with trusted professionals for all your needs</p>
      <div class="search-bar">
        <select v-model="selectedService">
          <option v-for="service in services" :key="service.value" :value="service.value">
            {{ service.label }}
          </option>
        </select>
        <input v-model="location" type="text" placeholder="Enter your location" />
        <button @click="searchServices">Search</button>
      </div>
    </section>
  </main>
</template>

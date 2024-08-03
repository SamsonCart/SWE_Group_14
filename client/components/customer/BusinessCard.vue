<template>
  <v-card class="article" @click="goToBusinessDetail(business._id)">
    <div class="article-wrapper">
      <figure>
        <v-img
          :src="
            business.images.length
              ? `${baseUrl}/uploads/images/${business.images[0]}`
              : defaultImage
          "
          cover
          alt="Business Image"
          aspect-ratio="16/9"
        ></v-img>
      </figure>
      <div class="article-body">
        <v-card-title
          ><nuxt-link :to="`/business/${id}`">{{
            business.name
          }}</nuxt-link></v-card-title
        >
        <v-card-text>
          <p>
            {{ business.description }}
          </p>
          <div class="mt-auto">
            <div class="d-flex align-center">
              <v-icon left size="16" class="mr-2">mdi-phone</v-icon>
              {{ business.phonenumber }}
            </div>
            <div class="d-flex align-center">
              <v-icon left size="16" class="mr-2">mdi-email</v-icon>
              {{ business.email }}
            </div>
            <div class="d-flex align-center">
              <v-icon left size="16" class="mr-2">mdi-map-marker</v-icon>
              <div>
                {{ business.address.street }}, {{ business.address.city }},
                {{ business.address.state }},
              </div>
            </div>
          </div>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  business: Object // Defining props with business as an object
});

const baseUrl = import.meta.env.VITE_API_ENDPOINT; // Base URL for API endpoint from environment variables
const defaultImage = 'https://via.placeholder.com/800x450'; // Default image URL

const router = useRouter(); // Using the Vue router
const goToBusinessDetail = (id) => {
  router.push(`/business/${id}`); // Navigating to business detail page
};
</script>

<style scoped>
.pa-2 {
  padding: 8px; /* Padding for business images */
}

.articles {
  display: grid;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 24px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.article {
  --img-scale: 1.001;
  --title-color: black;
  --link-icon-translate: -20px;
  --link-icon-opacity: 0;
  position: relative;
  border-radius: 16px;
  box-shadow: none;
  background: #fff;
  transform-origin: center;
  transition: all 0.4s ease-in-out;
  overflow: hidden;
  flex-grow: 1;
}

.article a::after {
  position: absolute;
  inset-block: 0;
  inset-inline: 0;
  cursor: pointer;
  content: '';
}

/* basic article elements styling */
.article h2 {
  margin: 0 0 18px 0;
  font-family: 'Bebas Neue', cursive;
  font-size: 1.9rem;
  letter-spacing: 0.06em;
  color: var(--title-color);
  transition: color 0.3s ease-out;
}

figure {
  margin: 0;
  padding: 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.article img {
  max-width: 100%;
  transform-origin: center;
  transform: scale(var(--img-scale));
  transition: transform 0.4s ease-in-out;
}

.article-body {
  padding: 12px 12px 24px;
}

.article a {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #28666e;
}

.article a:focus {
  outline: 1px dotted #28666e;
}

.article a .icon {
  min-width: 24px;
  width: 24px;
  height: 24px;
  margin-left: 5px;
  transform: translateX(var(--link-icon-translate));
  opacity: var(--link-icon-opacity);
  transition: all 0.3s;
}

/* using the has() relational pseudo selector to update our custom properties */
.article:has(:hover, :focus) {
  --img-scale: 1.1;
  --title-color: #28666e;
  --link-icon-translate: 0;
  --link-icon-opacity: 1;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
    rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
}

.sr-only:not(:focus):not(:active) {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
</style>

<template>
  <nuxt-link to="/" class="logo-link">
    <v-icon>mdi-vuetify</v-icon>
    <span class="ml-2">Vuetify App</span>
  </nuxt-link>
</template>

<script>
export default {
  name: 'Logo'
};
</script>

<style scoped>
.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.v-icon {
  font-size: 32px;
  color: #1867c0; /* Vuetify default primary color */
}

span {
  font-size: 24px;
  color: #1867c0; /* Vuetify default primary color */
}
</style>

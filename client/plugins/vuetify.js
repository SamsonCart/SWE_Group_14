import '@mdi/font/css/materialdesignicons.css'; // Import Material Design Icons CSS
import 'vuetify/styles'; // Import Vuetify styles
import { createVuetify } from 'vuetify'; // Import the createVuetify function

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({ 
    // Vuetify configuration options can be added here
  });
  app.vueApp.use(vuetify); // Register Vuetify with the Vue app
});

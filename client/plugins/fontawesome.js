import { library, config } from '@fortawesome/fontawesome-svg-core'; // Import FontAwesome core functions
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; // Import the FontAwesomeIcon component
import { fas } from '@fortawesome/free-solid-svg-icons'; // Import solid icons

// Prevent Nuxt from automatically adding FontAwesome CSS
config.autoAddCss = false;

// Add all solid icons to the library
library.add(fas);

export default defineNuxtPlugin(nuxtApp => {
  // Register FontAwesomeIcon component globally
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon, {});
});

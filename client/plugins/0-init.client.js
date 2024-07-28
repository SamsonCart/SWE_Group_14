import { useGlobalStateStore } from '@/store/globalState'; // Import the global state store

export default defineNuxtPlugin(async (nuxtApp) => {
  const globalStateStore = useGlobalStateStore(); // Access the global state store
  await globalStateStore.init(); // Initialize the global state store
});

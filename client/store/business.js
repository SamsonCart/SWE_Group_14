import { request } from '@/utils/request';
import { useNotificationStore } from '@/store/notificationStore';

const baseUrl = import.meta.env.VITE_API_ENDPOINT;

export const useBusinessStore = defineStore('business', {
  state: () =>
    reactive({
      business: {},
      services: []
    }),
  getters: {
    getBusiness: (state) => state.business,
    getServices: (state) => state.services
  },
  actions: {
    async getUserBusiness() {
      const notificationStore = useNotificationStore();
      try {
        const response = await request('get', 'dashboard/business');
        if (response) {
          this.business = response;
        }
      } catch (error) {
        notificationStore.showError('Error fetching business details');
        console.error('Error creating business:', error);
      }
    },
    async createBusiness(businessData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request('post', 'business', businessData);
        if (response) {
          this.business = response;
          notificationStore.showSuccess('Business created successfully');
        }
      } catch (error) {
        notificationStore.showError('Error creating business');
        console.error('Error creating business:', error);
      }
    },
    async updateBusiness(businessId, businessData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request(
          'put',
          `business/${businessId}`,
          businessData
        );
        if (response) {
          this.business = response;
          notificationStore.showSuccess('Business updated successfully');
        }
      } catch (error) {
        notificationStore.showError('Error updating business');
        console.error('Error updating business:', error);
      }
    },
    async getBusinessServices() {
      const notificationStore = useNotificationStore();
      try {
        const businessId = this.business._id;
        const response = await $fetch(`${baseUrl}/service`, {
          params: { businessId }
        });
        if (response) {
          this.services = response;
        }
      } catch (error) {
        notificationStore.showError('Error fetching services');
        console.error('Error fetching services:', error);
      }
    },
    async createService(serviceData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await $fetch(`${baseUrl}/service`, {
          method: 'post',
          body: serviceData
        });
        if (response) {
          this.services.push(response);
          notificationStore.showSuccess('Service created successfully');
        }
      } catch (error) {
        notificationStore.showError('Error creating service');
        console.error('Error creating service:', error);
      }
    },
    async updateService(serviceId, serviceData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await $fetch(`${baseUrl}/service/${serviceId}`, {
          method: 'put',
          body: serviceData
        });
        if (response) {
          this.services = this.services.map((service) =>
            service._id === serviceId ? response : service
          );
          notificationStore.showSuccess('Service updated successfully');
        }
      } catch (error) {
        notificationStore.showError('Error updating service');
        console.error('Error updating service:', error);
      }
    },
    async deleteService(serviceId) {
      const notificationStore = useNotificationStore();
      try {
        const response = await $fetch(`${baseUrl}/service/${serviceId}`, {
          method: 'delete'
        });
        if (response) {
          this.services = this.services.filter(
            (service) => service._id !== serviceId
          );
          notificationStore.showSuccess('Service deleted successfully');
        }
      } catch (error) {
        notificationStore.showError('Error deleting service');
        console.error('Error deleting service:', error);
      }
    }
  }
});

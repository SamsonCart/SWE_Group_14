import { defineStore } from 'pinia';
import { useNotificationStore } from '@/store/notification';
import { request } from '@/utils/request';

export const useBusinessStore = defineStore('business', {
  state: () => ({
    business: null,
    services: [],
    bookings: [],
  }),
  getters: {
    getBusiness: (state) => state.business,
    getServices: (state) => state.services,
    getBookings: (state) => state.bookings,
  },
  actions: {
    async getUserBusiness() {
      const notificationStore = useNotificationStore();
      try {
        const response = await request('get', '/dashboard/business');
        console.log('rrrr :>> ', response);
        if (response?.data) {
          this.business = response.data;
        }
      } catch (error) {
        notificationStore.showError('Error fetching business details');
        console.error('Error fetching business:', error);
      }
    },
    async createBusiness(businessData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request('post', '/business', businessData);
        if (response?.data) {
          this.business = response.data;
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
          `/business/${businessId}`,
          businessData
        );
        if (response?.data) {
          this.business = response.data;
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
        const response = await request('get', `/service`, { businessId });
        console.log('response :>> ', response);
        if (response?.data) {
          this.services = response.data;
        }
      } catch (error) {
        notificationStore.showError('Error fetching services');
        console.error('Error fetching services:', error);
      }
    },
    async createService(serviceData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request('post', `/service`, serviceData);
        if (response?.data) {
          this.services.push(response.data);
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
        const response = await request(
          'put',
          `/service/${serviceId}`,
          serviceData
        );
        if (response?.data) {
          this.services = this.services.map((service) =>
            service._id === serviceId ? response.data : service
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
        const response = await request('delete', `/service/${serviceId}`);
        if (response?.data) {
          this.services = this.services.filter(
            (service) => service._id !== serviceId
          );
          notificationStore.showSuccess('Service deleted successfully');
        }
      } catch (error) {
        notificationStore.showError('Error deleting service');
        console.error('Error deleting service:', error);
      }
    },
    async getServiceBookings() {
      const notificationStore = useNotificationStore();
      try {
        const businessId = this.business._id;
        const response = await request('get', `/booking`, { businessId });
        if (response?.data) {
          this.bookings = response.data;
        }
      } catch (error) {
        notificationStore.showError('Error fetching bookings');
        console.error('Error fetching bookings:', error);
      }
    },
    async createBooking(bookingData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request('post', `/booking`, bookingData);
        if (response?.data) {
          this.bookings.push(response.data);
          notificationStore.showSuccess('Booking created successfully');
        }
      } catch (error) {
        notificationStore.showError('Error creating booking');
        console.error('Error creating booking:', error);
      }
    },
    async updateBooking(bookingId, bookingData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request(
          'put',
          `/booking/${bookingId}`,
          bookingData
        );
        if (response?.data) {
          const index = this.bookings.findIndex(
            (booking) => booking._id === bookingId
          );
          if (index !== -1) {
            this.bookings.splice(index, 1, response.data);
          }
          notificationStore.showSuccess('Booking updated successfully');
        }
      } catch (error) {
        notificationStore.showError('Error updating booking');
        console.error('Error updating booking:', error);
      }
    },
    async deleteBooking(bookingId) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request('delete', `/booking/${bookingId}`);
        if (response?.data) {
          this.bookings = this.bookings.filter(
            (booking) => booking._id !== bookingId
          );
          notificationStore.showSuccess('Booking deleted successfully');
        }
      } catch (error) {
        notificationStore.showError('Error deleting booking');
        console.error('Error deleting booking:', error);
      }
    },

  }
});

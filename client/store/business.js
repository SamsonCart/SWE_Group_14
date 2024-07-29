import { defineStore } from 'pinia';
import { useNotificationStore } from '@/store/notification';
import { request } from '@/utils/request';
import { useUserStore } from './user';

export const useBusinessStore = defineStore('business', {
  state: () => ({
    business: null,
    services: [],
    bookings: []
  }),
  getters: {
    getBusiness: (state) => state.business,
    getServices: (state) => state.services,
    getBookings: (state) => state.bookings
  },
  actions: {
    reset() {
      this.business = null;
      this.services = [];
      this.bookings = [];
    },
    // Fetches the business associated with the current user
    async getUserBusiness() {
      const notificationStore = useNotificationStore();
      try {
        const userStore = useUserStore();
        const owner = userStore.getUser.id;
        console.log('owner :>> ', owner);
        const response = await request('get', 'business', { owner });

        if (response?.data) {
          this.business = response.data[0];
        } else {
          this.business = null;
        }
      } catch (error) {
        notificationStore.showError('Error fetching business details');
        console.error('Error fetching business:', error);
      }
    },
    // Creates a new business
    async createBusiness(businessData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request('post', 'business', businessData);
        if (response?.data) {
          this.business = response.data;
          notificationStore.showSuccess('Business created successfully');
        }
      } catch (error) {
        notificationStore.showError('Error creating business');
        console.error('Error creating business:', error);
      }
    },
    // Updates an existing business
    async updateBusiness(businessId, businessData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request(
          'put',
          `business/${businessId}`,
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
    // Fetches services for the current business
    async getBusinessServices() {
      const notificationStore = useNotificationStore();
      try {
        const businessId = this.business._id;
        const response = await request('get', `/service`, { businessId });
        if (response?.data) {
          this.services = response.data;
        }
      } catch (error) {
        notificationStore.showError('Error fetching services');
        console.error('Error fetching services:', error);
      }
    },
    // Creates a new service
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
    // Updates an existing service
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
    // Deletes a service
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
    // Fetches bookings for the current business
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
    // Creates a new booking
    async createBooking(bookingData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request('post', `/booking`, bookingData);
        if (response?.data) {
          // this.bookings.push(response.data);
          notificationStore.showSuccess('Booking created successfully');
        }
      } catch (error) {
        notificationStore.showError('Error creating booking');
        console.error('Error creating booking:', error);
      }
    },
    // Updates an existing booking
    async updateBooking(bookingId, bookingData) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request(
          'put',
          `/booking/${bookingId}`,
          bookingData
        );
        if (response?.data) {
          this.bookings = this.bookings.map((booking) => {
            if (response.data._id === bookingId) {
              return {
                ...booking,
                date: response.data.date,
                customerId: response.data.customerId,
                customerName: response.data.customerName,
                customerEmail: response.data.customerEmail,
                customerEmail: response.data.customerPhonenumber,
                startTime: response.data.startTime,
                endTime: response.data.endTime,
                status: response.data.status
              };
            }
            return booking;
          });
          notificationStore.showSuccess('Booking updated successfully');
        }
      } catch (error) {
        notificationStore.showError('Error updating booking');
        console.error('Error updating booking:', error);
      }
    },
    // Deletes a booking
    async deleteBooking(bookingId) {
      const notificationStore = useNotificationStore();
      try {
        const response = await request('delete', `/booking/${bookingId}`);
        if (response?.data) {
          this.bookings = this.bookings.filter(
            (booking) => response.data._id !== bookingId
          );
          notificationStore.showSuccess('Booking deleted successfully');
        }
      } catch (error) {
        notificationStore.showError('Error deleting booking');
        console.error('Error deleting booking:', error);
      }
    }
  }
});

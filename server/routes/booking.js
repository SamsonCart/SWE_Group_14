const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController'); // Controller for booking actions
const {
  validateBookingCreate,
  validateBookingUpdate
} = require('../middlewares/validators'); // Middleware for booking validation

// Route to create a new booking
router.post('/', validateBookingCreate, bookingController.createBooking);

// Route to get all bookings with optional filters
router.get('/', bookingController.getBookings);

// Route to get a single booking by ID
router.get('/:id', bookingController.getBookingById);

// Route to update a booking by ID
router.put('/:id', validateBookingUpdate, bookingController.updateBooking);

// Route to delete a booking by ID
router.delete('/:id', bookingController.deleteBooking);

// Export the router for use in the main router file
module.exports = router;

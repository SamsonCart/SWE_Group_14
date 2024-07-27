const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const {
  validateBookingCreate,
  validateBookingUpdate
} = require('../middlewares/validators');

// Create a new booking
router.post('/', validateBookingCreate, bookingController.createBooking);

// Get all bookings with optional filters
router.get('/', bookingController.getBookings);

// Get a single booking by ID
router.get('/:id', bookingController.getBookingById);

// Update a booking by ID
router.put('/:id', validateBookingUpdate, bookingController.updateBooking);

// Delete a booking by ID
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;

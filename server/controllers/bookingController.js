const mongoose = require('mongoose');
const Booking = require('../models/booking');
const Service = require('../models/service'); // Adjust the path as necessary
const User = require('../models/user'); // Adjust the path as necessary

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    return res.status(201).json({ isSuccess: true, data: newBooking });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { businessId, customerId, serviceId, status, startDate, endDate } =
      req.query;
    const match = {};

    if (customerId) match.customerId = mongoose.Types.ObjectId(customerId);
    if (serviceId) match.serviceId = mongoose.Types.ObjectId(serviceId);
    if (status) match.status = status;
    if (startDate || endDate) match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      {
        $lookup: {
          from: 'users',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' }
    ];

    if (businessId) {
      pipeline.push({
        $match: { 'service.businessId': mongoose.Types.ObjectId(businessId) }
      });
    }

    pipeline.push({
      $project: {
        _id: 1,
        date: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        service: { id: '$service._id', name: '$service.title' },
        customer: { id: '$customer._id', email: '$customer.email' }
      }
    });

    const bookings = await Booking.aggregate(pipeline);

    return res.status(200).json({ isSuccess: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.status(200).json({ isSuccess: true, data: booking });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a booking by ID
exports.updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBooking)
      return res.status(404).json({ error: 'Booking not found' });
    return res.status(200).json({ isSuccess: true, data: updatedBooking });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking)
      return res.status(404).json({ error: 'Booking not found' });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

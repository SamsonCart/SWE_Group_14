const Review = require('../models/review');
const Business = require('../models/business');
const User = require('../models/user');
const mongoose = require('mongoose');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    return res.status(201).json({ isSuccess: true, data: newReview });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all reviews with optional filters
exports.getReviews = async (req, res) => {
  try {
    const { customerId, businessId } = req.query;
    const match = {};

    if (customerId) match.customer = mongoose.Types.ObjectId(customerId);
    if (businessId) match.business = mongoose.Types.ObjectId(businessId);

    const reviews = await Review.find(match)
      .populate('customer', 'firstname lastname email')
      .populate('business', 'name email');

    return res.status(200).json({ isSuccess: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('customer', 'firstname lastname email')
      .populate('business', 'name email');
    if (!review) return res.status(404).json({ error: 'Review not found' });
    return res.status(200).json({ isSuccess: true, data: review });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReview)
      return res.status(404).json({ error: 'Review not found' });
    return res.status(200).json({ isSuccess: true, data: updatedReview });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview)
      return res.status(404).json({ error: 'Review not found' });
    return res.status(200).json({ isSuccess: true, message: 'Review deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Customer update review
exports.updateCustomerReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating: req.body.rating, comment: req.body.comment },
      { new: true }
    );
    if (!updatedReview)
      return res.status(404).json({ error: 'Review not found' });
    return res.status(200).json({ isSuccess: true, data: updatedReview });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Business respond to review
exports.respondToReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { response: req.body.response },
      { new: true }
    );
    if (!updatedReview)
      return res.status(404).json({ error: 'Review not found' });
    return res.status(200).json({ isSuccess: true, data: updatedReview });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const {
  validateReviewCreate,
  validateReviewUpdate
} = require('../middlewares/validators');

// Create a new review
router.post('/', validateReviewCreate, reviewController.createReview);

// Get all reviews
router.get('/', reviewController.getReviews);

// Get a single review by ID
router.get('/:id', reviewController.getReviewById);

// Update a review
router.put('/:id', validateReviewUpdate, reviewController.updateReview);

// Delete a review
router.delete('/:id', reviewController.deleteReview);

// Customer update review
router.patch(
  '/:id/customer',
  validateReviewUpdate,
  reviewController.updateCustomerReview
);

// Business respond to review
router.patch('/:id/response', reviewController.respondToReview);

module.exports = router;

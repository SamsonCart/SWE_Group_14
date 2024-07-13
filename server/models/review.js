const mongoose = require('mongoose')

const Review = mongoose.model(
  'Review',
  new mongoose.Schema({
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    businessResponse: {
      comment: String,
      respondedAt: Date
    }
  })
)

module.module.exports = Review
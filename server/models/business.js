const mongoose = require('mongoose')

const Business = mongoose.model(
  'Business',
  new mongoose.Schema({
    businessName: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    services: [String],
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    phoneNumber: String,
    email: String,
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  })
)

module.exports = Business
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Business = mongoose.model(
  'Business',
  new mongoose.Schema({
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    businessName: {
      type: String,
      required: true,
      // unique: true
    },
    description: String,
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
);

module.exports = Business;

const mongoose = require('mongoose')

const AvailabilitySchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Availability', AvailabilitySchema)
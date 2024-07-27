const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  availability: [
    {
      dayOfWeek: { type: Number, required: true }, // 0 for Sunday, 1 for Monday, etc.
      startTime: { type: String, required: true }, // Format: 'HH:mm'
      endTime: { type: String, required: true }, // Format: 'HH:mm'
      sessionDuration: { type: Number, required: true } // Duration in minutes
    }
  ],
});

module.exports = mongoose.model('Service', ServiceSchema);

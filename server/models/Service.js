const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  availableSlots: [{ type: Schema.Types.ObjectId, ref: 'Availability' }]
});

module.exports = mongoose.model('Service', ServiceSchema);

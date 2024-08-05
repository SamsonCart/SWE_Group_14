const Inquiry = require('../models/inquiry');
const User = require('../models/user');
const Business = require('../models/business');

// Create a new inquiry
exports.createInquiry = async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.status(201).json({ isSuccess: true, data: newInquiry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all inquiries
exports.getInquiries = async (req, res) => {
  try {
    const { customerId, businessId } = req.query;
    const filter = {};

    if (customerId) {
      filter.customer = customerId;
    }

    if (businessId) {
      filter.business = businessId;
    }

    const inquiries = await Inquiry.find(filter)
      .populate('customer', 'firstname lastname email')
      .populate('business', 'name');

    res.status(200).json({ isSuccess: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single inquiry by ID
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('customer')
      .populate('business');
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.status(200).json({ isSuccess: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an inquiry
exports.updateInquiry = async (req, res) => {
  try {
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedInquiry)
      return res.status(404).json({ error: 'Inquiry not found' });
    res.status(200).json({ isSuccess: true, data: updatedInquiry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const deletedInquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deletedInquiry)
      return res.status(404).json({ error: 'Inquiry not found' });
    res.status(200).json({ isSuccess: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Business respond to inquiry
exports.respondToInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    inquiry.response = req.body;
    await inquiry.save();
    res.status(200).json({ isSuccess: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

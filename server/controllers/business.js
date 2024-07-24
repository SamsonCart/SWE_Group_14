const Business = require('../models/business');

exports.createBusiness = async (req, res) => {
  try {
    const business = new Business(req.body);
    await business.save();
    res.status(201).send(business);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate('owner services');
    res.status(200).send(businesses);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate(
      'owner services'
    );
    if (!business) {
      return res.status(404).send();
    }
    res.status(200).send(business);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!business) {
      return res.status(404).send();
    }
    res.status(200).send(business);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.partialUpdateBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!business) {
      return res.status(404).send();
    }
    res.status(200).send(business);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) {
      return res.status(404).send();
    }
    res.status(200).send(business);
  } catch (error) {
    res.status(500).send(error);
  }
};

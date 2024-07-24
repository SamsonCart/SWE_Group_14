const Availability = require('../models/availability');

exports.createAvailability = async (req, res) => {
  try {
    const availability = new Availability(req.body);
    await availability.save();
    res.status(201).send(availability);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAvailabilities = async (req, res) => {
  try {
    const availabilities = await Availability.find().populate('businessId');
    res.status(200).send(availabilities);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAvailabilityById = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id).populate(
      'businessId'
    );
    if (!availability) {
      return res.status(404).send();
    }
    res.status(200).send(availability);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const availability = await Availability.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!availability) {
      return res.status(404).send();
    }
    res.status(200).send(availability);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.partialUpdateAvailability = async (req, res) => {
  try {
    const availability = await Availability.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!availability) {
      return res.status(404).send();
    }
    res.status(200).send(availability);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findByIdAndDelete(req.params.id);
    if (!availability) {
      return res.status(404).send();
    }
    res.status(200).send(availability);
  } catch (error) {
    res.status(500).send(error);
  }
};

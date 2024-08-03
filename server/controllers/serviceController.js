const Service = require('../models/service'); // Import Service model

// Create a new service
exports.createService = async (req, res) => {
  try {
    // Create a new instance of the Service model with request body data
    const service = new Service(req.body);

    // Save the service instance to the database
    await service.save();

    // Respond with a success status and the newly created service data
    res.status(201).send({ isSuccess: true, data: service });
  } catch (error) {
    // Respond with a 400 Bad Request status and the error
    res.status(400).send(error);
  }
};

// Get all services with optional filtering by businessId and name
exports.getServices = async (req, res) => {
  try {
    const { businessId, query } = req.query;

    // Construct filter object based on query parameters
    const filter = businessId ? { businessId } : {};

    // Add search by service title and description if query is provided
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } }, // Case-insensitive regex search for title
        { description: { $regex: query, $options: 'i' } } // Case-insensitive regex search for description
      ];
    }

    // Find services matching the filter and populate the availableSlots field
    const services = await Service.find(filter).populate('availableSlots');

    // Respond with a success status and the retrieved services data
    res.status(200).send({ isSuccess: true, data: services });
  } catch (error) {
    // Respond with a 500 Internal Server Error status and the error
    res.status(500).send(error);
  }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
  try {
    // Find a service by its ID and populate the availableSlots field
    const service = await Service.findById(req.params.id).populate(
      'availableSlots'
    );

    // Check if the service exists
    if (!service) {
      // Respond with a 404 Not Found status if the service does not exist
      return res.status(404).send();
    }

    // Respond with a success status and the retrieved service data
    res.status(200).send({ isSuccess: true, data: service });
  } catch (error) {
    // Respond with a 500 Internal Server Error status and the error
    res.status(500).send(error);
  }
};

// Update a service by ID
exports.updateService = async (req, res) => {
  try {
    // Find and update the service by its ID, ensuring new document is returned and validators are run
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Check if the service exists
    if (!service) {
      // Respond with a 404 Not Found status if the service does not exist
      return res.status(404).send();
    }

    // Respond with a success status and the updated service data
    res.status(200).send({ isSuccess: true, data: service });
  } catch (error) {
    // Respond with a 400 Bad Request status and the error
    res.status(400).send(error);
  }
};

// Partial update for a service by ID (similar to full update)
exports.partialUpdateService = async (req, res) => {
  try {
    // Find and update the service by its ID, ensuring new document is returned and validators are run
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Check if the service exists
    if (!service) {
      // Respond with a 404 Not Found status if the service does not exist
      return res.status(404).send();
    }

    // Respond with a success status and the updated service data
    res.status(200).send({ isSuccess: true, data: service });
  } catch (error) {
    // Respond with a 400 Bad Request status and the error
    res.status(400).send(error);
  }
};

// Delete a service by ID
exports.deleteService = async (req, res) => {
  try {
    // Find and delete the service by its ID
    const service = await Service.findByIdAndDelete(req.params.id);

    // Check if the service exists
    if (!service) {
      // Respond with a 404 Not Found status if the service does not exist
      return res.status(404).send();
    }

    // Respond with a 204 No Content status indicating successful deletion
    res.status(204).send();
  } catch (error) {
    // Respond with a 500 Internal Server Error status and the error
    res.status(500).send(error);
  }
};

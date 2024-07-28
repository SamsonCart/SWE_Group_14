const Business = require('../models/business'); // Import the Business model
const User = require('../models/user'); // Import the User model
const fs = require('fs'); // File system module to handle file operations
const path = require('path'); // Module to work with file and directory paths
const geolib = require('geolib'); // Library to handle geographical calculations

const TEMP_DIR = 'uploads/temp'; // Directory for temporary image uploads
const LIVE_DIR = 'uploads/images'; // Directory for final image storage

/**
 * Create a new business entry.
 * @param {Object} req - The request object, containing the business data and images.
 * @param {Object} res - The response object used to send responses to the client.
 */
exports.createBusiness = async (req, res) => {
  try {
    const businessData = req.body;

    // Move images from the temporary directory to the live directory
    if (req.body.images) {
      businessData.images = req.body.images.map((image) => {
        const tempPath = path.join(
          __dirname,
          '..',
          TEMP_DIR,
          image.replace('temp/', '')
        );
        const livePath = path.join(
          __dirname,
          '..',
          LIVE_DIR,
          image.replace('temp/', '')
        );
        fs.renameSync(tempPath, livePath); // Move the file
        return image;
      });
    }

    const business = new Business(businessData); // Create a new Business instance
    await business.save(); // Save the business to the database
    res.status(201).send({ isSuccess: true, data: business }); // Send success response
  } catch (error) {
    res.status(400).send(error); // Send error response
  }
};

/**
 * Get a list of all businesses or businesses by owner.
 * @param {Object} req - The request object, containing optional query parameters.
 * @param {Object} res - The response object used to send responses to the client.
 */
exports.getBusinesses = async (req, res) => {
  try {
    const { owner } = req.query; // Extract owner from query parameters
    let match = owner ? { owner } : {}; // Match query condition
    const businesses = await Business.find(match); // Find businesses matching the condition
    res.status(200).send({ isSuccess: true, data: businesses }); // Send success response
  } catch (error) {
    res.status(500).send(error); // Send error response
  }
};

/**
 * Get a business by its ID.
 * @param {Object} req - The request object, containing the business ID.
 * @param {Object} res - The response object used to send responses to the client.
 */
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate(
      'owner services'
    ); // Find business by ID and populate related fields
    if (!business) {
      return res.status(404).send(); // Send 404 if business not found
    }
    res.status(200).send({ isSuccess: true, data: business }); // Send success response
  } catch (error) {
    res.status(500).send(error); // Send error response
  }
};

/**
 * Get businesses within a specified distance from a user's location.
 * @param {Object} req - The request object, containing customerId and distance.
 * @param {Object} res - The response object used to send responses to the client.
 */
exports.getBusinessByDistance = async (req, res) => {
  try {
    const { customerId, distance } = req.query; // Extract customerId and distance from query parameters

    // Find the user by customerId
    const user = await User.findById(customerId);
    if (!user) {
      return res
        .status(404)
        .send({ isSuccess: false, message: 'User not found' }); // Send 404 if user not found
    }

    const userCoords = user.address.coordinates; // Get user's coordinates

    // Find all businesses
    const businesses = await Business.find({});

    // Filter businesses within the specified distance
    const nearbyBusinesses = businesses.filter((business) => {
      const businessCoords = business.address.coordinates;
      const distanceInMeters = geolib.getDistance(userCoords, businessCoords);
      const distanceInMiles = geolib.convertDistance(distanceInMeters, 'mi');
      return distanceInMiles <= distance; // Check if the business is within the specified distance
    });

    res.status(200).send({ isSuccess: true, data: nearbyBusinesses }); // Send success response
  } catch (error) {
    res.status(500).send(error); // Send error response
  }
};

/**
 * Update a business entry by its ID.
 * @param {Object} req - The request object, containing the business ID and updated data.
 * @param {Object} res - The response object used to send responses to the client.
 */
exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id); // Find business by ID
    if (!business) {
      return res.status(404).send(); // Send 404 if business not found
    }

    const originalImages = business.images || [];
    const newImages = req.body.images || [];

    // Determine which images have been removed
    const removedImages = originalImages.filter(
      (img) => !newImages.includes(img)
    );

    // Delete removed images from the live directory
    removedImages.forEach((img) => {
      const imgPath = path.join(__dirname, '..', LIVE_DIR, img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath); // Delete the file
      }
    });

    // Move new images from temp to live directory
    const updatedImages = newImages.map((img) => {
      if (img.startsWith('temp/')) {
        const tempPath = path.join(
          __dirname,
          '..',
          TEMP_DIR,
          img.replace('temp/', '')
        );
        const newPath = path.join(
          __dirname,
          '..',
          LIVE_DIR,
          img.replace('temp/', '')
        );
        fs.renameSync(tempPath, newPath); // Move the file
        return img.replace('temp/', '');
      }
      return img;
    });

    console.log('updateBusiness :>> updatedImages', updatedImages);
    Object.assign(business, req.body); // Update business data
    business.images = updatedImages; // Update image list
    await business.save(); // Save the updated business

    res.status(200).send({ isSuccess: true, data: business }); // Send success response
  } catch (error) {
    res.status(400).send(error); // Send error response
  }
};

/**
 * Partially update a business entry by its ID.
 * @param {Object} req - The request object, containing the business ID and partial update data.
 * @param {Object} res - The response object used to send responses to the client.
 */
exports.partialUpdateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id); // Find business by ID
    if (!business) {
      return res.status(404).send(); // Send 404 if business not found
    }

    const originalImages = business.images || [];
    const newImages = req.body.images || [];

    // Determine which images have been removed
    const removedImages = originalImages.filter(
      (img) => !newImages.includes(img)
    );

    // Delete removed images from the live directory
    removedImages.forEach((img) => {
      const imgPath = path.join(__dirname, '..', LIVE_DIR, img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath); // Delete the file
      }
    });

    // Move new images from temp to live directory
    const updatedImages = newImages.map((img) => {
      if (img.startsWith('temp/')) {
        const tempPath = path.join(
          __dirname,
          '..',
          TEMP_DIR,
          img.replace('temp/', '')
        );
        const newPath = path.join(
          __dirname,
          '..',
          LIVE_DIR,
          img.replace('temp/', '')
        );
        fs.renameSync(tempPath, newPath); // Move the file
        return img.replace('temp/', '');
      }
      return img;
    });

    business.images = updatedImages; // Update image list
    Object.assign(business, req.body); // Update business data
    await business.save(); // Save the updated business

    res.status(200).send({ isSuccess: true, data: business }); // Send success response
  } catch (error) {
    res.status(400).send(error); // Send error response
  }
};

/**
 * Delete a business entry by its ID.
 * @param {Object} req - The request object, containing the business ID.
 * @param {Object} res - The response object used to send responses to the client.
 */
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id); // Find and delete business by ID
    if (!business) {
      return res.status(404).send(); // Send 404 if business not found
    }
    res.status(204); // Send 204 No Content response
  } catch (error) {
    res.status(500).send(error); // Send error response
  }
};

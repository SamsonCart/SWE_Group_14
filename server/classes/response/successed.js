// Import the custom Response class
const success = require('./success');

/**
 * Custom Success Response Handler
 * Formats and sends a success response in JSON format.
 * @param {object} res - The Express.js response object.
 * @param {any} data - The data to include in the response.
 * @param {string} [message=null] - Optional message to include in the response.
 * @returns {object} The JSON response with the success data and message.
 */
module.exports = (res, data, message) => {
  // Send the response with the success data and optional message
  return res.json(new success(data, null, null, message));
};

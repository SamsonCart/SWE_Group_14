// Import the custom FailedResponse class
const fail = require('./fail');

/**
 * Custom Failed Response Handler
 * Formats and sends a failure response in JSON format.
 * @param {object} res - The Express.js response object.
 * @param {string|object} message - The error message or array of error messages to include in the response.
 * @param {number} [status=200] - The HTTP status code to send with the response.
 * @returns {object} The JSON response with a failure message.
 */
module.exports = (res, message, status = 200) => {
  // Format the message if it's an array of strings
  if (message && typeof message === 'object') {
    message = `<ul><li>${message.join('</li><li>')}</li></ul>`;
  }

  // Send the response with the failure message and status code
  return res.status(status).json(new fail(message));
};

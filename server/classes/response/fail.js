// Import the custom logger utility
const logger = require('../../utils/logger');

/**
 * Custom Error Response Class
 * Extends the built-in Error class to provide additional functionality for handling errors.
 * Logs error details using a custom logger.
 */
class FailedResponse extends Error {
  /**
   * Constructor for the FailedResponse class.
   * @param {string} message - The error message to be set.
   */
  constructor(message) {
    // Call the parent class constructor
    super();
    this.message = message; // Set the error message
    this.isSuccess = false; // Indicates that this is a failure response

    // Log the error details using the custom logger
    logger.error(`Error.Name: ${this.name} - Error.Stack: ${this.stack}`);
  }
}

// Export the FailedResponse class for use in other modules
module.exports = FailedResponse;

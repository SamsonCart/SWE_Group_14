/**
 * Custom Response Class
 * Represents a successful response with optional metadata.
 */
class Response {
  /**
   * Constructor for the Response class.
   * @param {any} data - The data to be included in the response.
   * @param {number} [count=null] - Optional count of items (e.g., total items).
   * @param {object} [pagination=null] - Optional pagination details.
   * @param {string} [message=null] - Optional message to include in the response.
   */
  constructor(data, count = null, pagination = null, message = null) {
    this.isSuccess = true; // Indicates that this is a success response
    this.data = data; // The data to be returned
    this.count = count; // Optional count of items
    this.message = message; // Optional message
    this.pagination = pagination; // Optional pagination details
  }
}

// Export the Response class for use in other modules
module.exports = Response;

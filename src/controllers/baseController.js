// Base controller class for MCP services

class BaseController {
  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {Object} data - Response data
   * @param {number} statusCode - HTTP status code
   */
  sendSuccess(res, data, statusCode = 200) {
    res.status(statusCode).json({
      success: true,
      data
    });
  }

  /**
   * Send error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {string} errorCode - Application-specific error code
   */
  sendError(res, message, statusCode = 500, errorCode = 'UNKNOWN_ERROR') {
    res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message
      }
    });
  }
}

module.exports = BaseController;
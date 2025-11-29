// Error utilities for MCP Server

const { MCPError } = require('../middleware/errorHandler');
const logger = require('./logger');

/**
 * Create a standardized MCP error
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} errorCode - Application-specific error code
 * @returns {MCPError} MCPError instance
 */
const createError = (message, statusCode = 500, errorCode = 'UNKNOWN_ERROR') => {
  return new MCPError(message, statusCode, errorCode);
};

/**
 * Handle async controller functions with proper error propagation
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validate required parameters
 * @param {Object} params - Parameters to validate
 * @param {Array<string>} required - Required parameter names
 * @throws {MCPError} If validation fails
 */
const validateRequiredParams = (params, required) => {
  for (const param of required) {
    if (!(param in params) || params[param] === undefined || params[param] === null) {
      throw createError(
        `Missing required parameter: ${param}`,
        400,
        'MISSING_PARAMETER'
      );
    }
  }
};

/**
 * Validate parameter against allowed values
 * @param {string} param - Parameter name
 * @param {any} value - Parameter value
 * @param {Array<any>} allowed - Allowed values
 * @throws {MCPError} If validation fails
 */
const validateAllowedValues = (param, value, allowed) => {
  if (!allowed.includes(value)) {
    throw createError(
      `Invalid value for ${param}: ${value}. Allowed values: ${allowed.join(', ')}`,
      400,
      'INVALID_VALUE'
    );
  }
};

module.exports = {
  createError,
  asyncHandler,
  validateRequiredParams,
  validateAllowedValues,
  MCPError
};
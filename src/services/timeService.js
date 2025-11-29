// Time service for MCP Server

const BaseService = require('./baseService');
const { MCPError } = require('../middleware/errorHandler');
const { validateAllowedValues } = require('../utils/errorUtils');
const logger = require('../utils/logger');

class TimeService extends BaseService {
  /**
   * Get current system time information
   * @param {string} format - Response format ('timestamp' or 'formatted')
   * @returns {Object} Time information based on requested format
   */
  getTime(format) {
    try {
      // Validate format parameter
      const validFormats = ['timestamp', 'formatted', 'both'];
      
      // Handle case where format is undefined or null
      if (format === undefined || format === null) {
        format = 'timestamp'; // Default to timestamp
      }
      
      validateAllowedValues('format', format, validFormats);
      
      const timeInfo = this.getCurrentTimeInfo();
      
      logger.info('Time retrieved', { format, timestamp: timeInfo.timestamp });
      
      switch (format) {
        case 'timestamp':
          return { timestamp: timeInfo.timestamp };
        case 'formatted':
          return { formatted: timeInfo.formatted };
        case 'both':
          return timeInfo;
        default:
          // This shouldn't happen due to validation above, but kept for safety
          throw new MCPError(
            `Invalid format parameter: ${format}. Supported formats: 'timestamp', 'formatted', 'both'`,
            400,
            'INVALID_FORMAT'
          );
      }
    } catch (error) {
      logger.error('Failed to get time', { error: error.message });
      // Re-throw MCP errors as-is
      if (error instanceof MCPError) {
        throw error;
      }
      // Wrap unexpected errors
      throw new MCPError(
        'Failed to retrieve system time',
        500,
        'TIME_RETRIEVAL_FAILED'
      );
    }
  }
}

module.exports = TimeService;
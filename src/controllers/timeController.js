// Time controller for MCP Server

const BaseController = require('./baseController');
const TimeService = require('../services/timeService');
const { MCPError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class TimeController extends BaseController {
  constructor() {
    super();
    this.timeService = new TimeService();
  }

  /**
   * Get current system time
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getTime(req, res, next) {
    try {
      const { format } = req.query;
      
      const timeData = this.timeService.getTime(format);
      
      logger.info('Time request processed', { 
        format, 
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      this.sendSuccess(res, timeData);
    } catch (error) {
      // Pass error to global error handler
      next(error);
    }
  }
}

module.exports = TimeController;
// Plugin middleware for MCP Server - Future extension point

const logger = require('../utils/logger');

/**
 * Plugin middleware that allows plugins to process requests
 * This is a placeholder for future plugin integration
 */
const pluginMiddleware = (req, res, next) => {
  // This middleware is a placeholder for future plugin system
  // Plugins could hook into the request processing pipeline here
  
  // Example of how a plugin might be called:
  // if (pluginSystem && typeof pluginSystem.processRequest === 'function') {
  //   pluginSystem.processRequest(req, res, next);
  // } else {
  //   next();
  // }
  
  logger.debug('Plugin middleware executed', {
    url: req.url,
    method: req.method
  });
  
  // Continue to next middleware
  next();
};

module.exports = pluginMiddleware;
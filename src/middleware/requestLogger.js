// Request logging middleware

const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  // Log incoming request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Capture response data
  const originalSend = res.send;
  res.send = function(data) {
    // Log outgoing response
    logger.info('Outgoing response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString()
    });
    
    originalSend.call(this, data);
  };

  next();
};

module.exports = requestLogger;
// Main entry point for MCP Server

const express = require('express');
const config = require('./config');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const pluginMiddleware = require('./middleware/pluginMiddleware');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');
const PluginManager = require('./plugins/pluginManager');

// Create Express app
const app = express();
const PORT = config.server.port;
const HOST = config.server.host;

// Initialize plugin manager
const pluginManager = new PluginManager();

// Middleware
app.use(express.json());

// Request logging middleware (if enabled)
if (config.middleware.requestLogging) {
  app.use(requestLogger);
}

// Plugin middleware
app.use(pluginMiddleware);

// Load plugins
pluginManager.loadPlugins();

// Routes
app.use('/', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, HOST, () => {
  logger.info(`MCP Server listening at http://${HOST}:${PORT}`);
  
  // Initialize plugins with server instance
  const plugins = pluginManager.getPlugins();
  plugins.forEach(plugin => {
    if (typeof plugin.init === 'function') {
      try {
        plugin.init(server);
        logger.info(`Initialized plugin: ${plugin.name}`);
      } catch (error) {
        logger.error(`Failed to initialize plugin ${plugin.name}:`, error);
      }
    }
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down MCP Server...');
  server.close(() => {
    logger.info('MCP Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.info('Shutting down MCP Server...');
  server.close(() => {
    logger.info('MCP Server closed');
    process.exit(0);
  });
});

module.exports = app;
// Configuration module for MCP Server

const config = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/mcp-server.log'
  },
  api: {
    version: 'v1',
    basePath: '/api'
  },
  plugins: {
    enabled: process.env.PLUGINS_ENABLED === 'true' || false,
    directory: process.env.PLUGINS_DIRECTORY || './plugins'
  },
  middleware: {
    requestLogging: process.env.REQUEST_LOGGING !== 'false' // Enabled by default
  }
};

module.exports = config;
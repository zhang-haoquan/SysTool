// Plugin manager for MCP Server - Future extension point

const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');

class PluginManager {
  constructor() {
    this.plugins = [];
    this.pluginDirectory = path.resolve(config.plugins.directory);
  }

  /**
   * Load all plugins from the plugins directory
   */
  loadPlugins() {
    if (!config.plugins.enabled) {
      logger.info('Plugin system is disabled');
      return;
    }

    try {
      // Create plugins directory if it doesn't exist
      if (!fs.existsSync(this.pluginDirectory)) {
        fs.mkdirSync(this.pluginDirectory, { recursive: true });
        logger.info(`Created plugins directory: ${this.pluginDirectory}`);
        return;
      }

      // Read plugin directory
      const pluginFiles = fs.readdirSync(this.pluginDirectory);
      logger.info(`Found ${pluginFiles.length} potential plugins`);

      // Filter for JavaScript files
      const jsFiles = pluginFiles.filter(file => file.endsWith('.js'));
      
      // Load each plugin
      jsFiles.forEach(file => {
        try {
          const pluginPath = path.join(this.pluginDirectory, file);
          const plugin = require(pluginPath);
          
          // Validate plugin structure
          if (typeof plugin === 'object' && typeof plugin.name === 'string') {
            this.plugins.push(plugin);
            logger.info(`Loaded plugin: ${plugin.name}`);
          } else {
            logger.warn(`Invalid plugin format in file: ${file}`);
          }
        } catch (error) {
          logger.error(`Failed to load plugin ${file}:`, error);
        }
      });

      logger.info(`Successfully loaded ${this.plugins.length} plugins`);
    } catch (error) {
      logger.error('Error loading plugins:', error);
    }
  }

  /**
   * Get all loaded plugins
   * @returns {Array} Array of loaded plugins
   */
  getPlugins() {
    return this.plugins;
  }

  /**
   * Get plugin by name
   * @param {string} name - Plugin name
   * @returns {Object|null} Plugin object or null if not found
   */
  getPlugin(name) {
    return this.plugins.find(plugin => plugin.name === name) || null;
  }
}

module.exports = PluginManager;
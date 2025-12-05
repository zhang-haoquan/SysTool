const BaseController = require('./baseController');
const MCPService = require('../services/mcpService');

class MCPController extends BaseController {
  constructor() {
    super();
    this.mcpService = new MCPService();
    // 使用简单的console日志替代不存在的Logger
    this.logger = {
      info: (message, data) => console.log(`[MCPController INFO] ${message}`, data || ''),
      error: (message, error) => console.error(`[MCPController ERROR] ${message}`, error || '')
    };
  }

  /**
   * Handle MCP protocol requests
   */
  async handleMCPRequest(req, res) {
    try {
      const result = await this.mcpService.processMCPRequest(req.body);
      res.json(result);
    } catch (error) {
      this.logger.error('Error in handleMCPRequest:', error);
      this.sendErrorResponse(res, 500, 'INTERNAL_ERROR', 'Failed to process MCP request');
    }
  }

  /**
   * Health check endpoint for MCP service
   */
  async healthCheck(req, res) {
    try {
      res.json({
        status: 'healthy',
        service: 'MCP Service',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.logger.error('Error in healthCheck:', error);
      this.sendErrorResponse(res, 500, 'INTERNAL_ERROR', 'Health check failed');
    }
  }

  /**
   * Get MCP capabilities
   */
  async getCapabilities(req, res) {
    try {
      const capabilities = await this.mcpService.getCapabilities();
      res.json(capabilities);
    } catch (error) {
      this.logger.error('Error in getCapabilities:', error);
      this.sendErrorResponse(res, 500, 'INTERNAL_ERROR', 'Failed to retrieve capabilities');
    }
  }
}

module.exports = MCPController;
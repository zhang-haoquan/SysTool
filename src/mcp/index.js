const MCPHandler = require('./handler');
const express = require('express');

class MCPServer {
  constructor(options = {}) {
    this.options = {
      host: options.host || 'localhost',
      port: options.port || 3002,  // 更改为3002端口以避免冲突
      ...options
    };
    
    // 创建MCP处理器实例
    this.handler = new MCPHandler();
    
    // 使用简单的console日志替代不存在的Logger
    this.logger = {
      info: (message, data) => console.log(`[MCPServer INFO] ${message}`, data || ''),
      error: (message, error) => console.error(`[MCPServer ERROR] ${message}`, error || '')
    };
    
    // 初始化Express应用
    this.app = express();
    this.app.use(express.json());
    
    this.setupRoutes();
  }
  
  setupRoutes() {
    // 健康检查端点
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    // MCP协议端点
    this.app.post('/mcp', async (req, res) => {
      try {
        const result = await this.handler.handleRequest(req.body);
        res.json(result);
      } catch (error) {
        this.logger.error('Error handling MCP request:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }
  
  async start() {
    return new Promise((resolve, reject) => {
      this.httpServer = this.app.listen(this.options.port, this.options.host, () => {
        this.logger.info(`MCP Server listening at http://${this.options.host}:${this.options.port}`);
        resolve();
      });
      
      this.httpServer.on('error', (error) => {
        this.logger.error('Failed to start MCP server:', error);
        reject(error);
      });
    });
  }
  
  async stop() {
    if (this.httpServer) {
      return new Promise((resolve) => {
        this.httpServer.close(() => {
          this.logger.info('MCP Server stopped');
          resolve();
        });
      });
    }
  }
}

module.exports = MCPServer;
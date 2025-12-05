const MCPServer = require('./index');
// 移除不存在的Logger导入

// 使用简单的console日志替代不存在的Logger
const logger = {
  info: (message, data) => console.log(`[MCPStandaloneServer INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[MCPStandaloneServer ERROR] ${message}`, error || '')
};

// MCP服务器配置
const config = {
  host: process.env.MCP_HOST || 'localhost',
  port: process.env.MCP_PORT || 3001
};

// 创建并启动MCP服务器
async function startMCPServer() {
  const mcpServer = new MCPServer(config);
  
  try {
    await mcpServer.start();
    logger.info('MCP Server started successfully', { host: config.host, port: config.port });
    
    // 处理优雅关闭
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach(signal => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, shutting down MCP Server...`);
        await mcpServer.stop();
        logger.info('MCP Server stopped');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start MCP Server:', error);
    process.exit(1);
  }
}

// 如果直接运行此文件，则启动服务器
if (require.main === module) {
  startMCPServer();
}

module.exports = startMCPServer;
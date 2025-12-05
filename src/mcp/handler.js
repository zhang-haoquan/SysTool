class MCPHandler {
  constructor() {
    // 使用简单的console日志替代不存在的Logger
    this.logger = {
      info: (message, data) => console.log(`[MCPHandler INFO] ${message}`, data || ''),
      error: (message, error) => console.error(`[MCPHandler ERROR] ${message}`, error || '')
    };
  }

  /**
   * Handle MCP protocol requests
   * @param {Object} requestData - The MCP request data
   * @returns {Object} - The MCP response
   */
  async handleRequest(requestData) {
    try {
      this.logger.info('Handling MCP request', { method: requestData.method });
      
      // 根据不同的MCP方法处理请求
      switch (requestData.method) {
        case 'ping':
          return await this.handlePing(requestData);
        case 'list_resources':
          return await this.handleListResources(requestData);
        case 'read_resource':
          return await this.handleReadResource(requestData);
        case 'list_tools':
          return await this.handleListTools(requestData);
        case 'call_tool':
          return await this.handleCallTool(requestData);
        default:
          return this.createErrorResponse(
            -32601, 
            `Method not found: ${requestData.method}`,
            requestData.id
          );
      }
    } catch (error) {
      this.logger.error('Error handling MCP request:', error);
      return this.createErrorResponse(-32603, error.message, requestData.id);
    }
  }

  /**
   * Handle ping requests
   */
  async handlePing(requestData) {
    return this.createSuccessResponse({
      pong: new Date().toISOString()
    }, requestData.id);
  }

  /**
   * Handle list_resources requests
   */
  async handleListResources(requestData) {
    return this.createSuccessResponse({
      resources: [
        {
          uri: "resource://time-service",
          name: "Time Service",
          mimeType: "application/json",
          description: "Provides current time information"
        },
        {
          uri: "resource://llm-service",
          name: "LLM Service",
          mimeType: "application/json",
          description: "Provides language model capabilities"
        }
      ]
    }, requestData.id);
  }

  /**
   * Handle read_resource requests
   */
  async handleReadResource(requestData) {
    const { uri } = requestData.params;
    
    try {
      let content;
      
      switch (uri) {
        case "resource://time-service":
          content = [{
            text: JSON.stringify({
              currentTime: new Date().toISOString(),
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            })
          }];
          break;
        case "resource://llm-service":
          content = [{
            text: JSON.stringify({
              capabilities: ["text-generation", "chat-completion"],
              models: ["qwen-max", "qwen-plus"]
            })
          }];
          break;
        default:
          return this.createErrorResponse(
            -32601, 
            `Resource not found: ${uri}`,
            requestData.id
          );
      }
      
      return this.createSuccessResponse({
        contents: content
      }, requestData.id);
    } catch (error) {
      return this.createErrorResponse(-32603, error.message, requestData.id);
    }
  }

  /**
   * Handle list_tools requests
   */
  async handleListTools(requestData) {
    return this.createSuccessResponse({
      tools: [
        {
          name: "get_current_time",
          description: "Get the current time and date",
          inputSchema: {
            type: "object",
            properties: {},
            required: []
          }
        },
        {
          name: "generate_text",
          description: "Generate text using language model",
          inputSchema: {
            type: "object",
            properties: {
              prompt: {
                type: "string",
                description: "The prompt for text generation"
              },
              model: {
                type: "string",
                description: "The model to use for generation"
              }
            },
            required: ["prompt"]
          }
        }
      ]
    }, requestData.id);
  }

  /**
   * Handle call_tool requests
   */
  async handleCallTool(requestData) {
    const { name, arguments: args } = requestData.params;
    
    try {
      let content;
      
      switch (name) {
        case "get_current_time":
          content = [{
            text: JSON.stringify({
              currentTime: new Date().toISOString(),
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            })
          }];
          break;
        case "generate_text":
          // 这里应该调用实际的LLM服务
          content = [{
            text: `Generated text for prompt: ${args.prompt || 'No prompt provided'}`
          }];
          break;
        default:
          return this.createErrorResponse(
            -32601, 
            `Tool not found: ${name}`,
            requestData.id
          );
      }
      
      return this.createSuccessResponse({
        content: content
      }, requestData.id);
    } catch (error) {
      return this.createErrorResponse(-32603, error.message, requestData.id);
    }
  }

  /**
   * Create a success response
   */
  createSuccessResponse(result, id) {
    return {
      jsonrpc: "2.0",
      id: id,
      result: result
    };
  }

  /**
   * Create an error response
   */
  createErrorResponse(code, message, id) {
    return {
      jsonrpc: "2.0",
      id: id,
      error: {
        code: code,
        message: message
      }
    };
  }
}

module.exports = MCPHandler;
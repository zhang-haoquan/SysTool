// LLM Service for MCP Server

const BaseService = require('./baseService');
const { MCPError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const axios = require('axios');

class LLMService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Generate text using LLM
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated text response
   */
  async generateText(options) {
    try {
      const { prompt, maxTokens, temperature, model } = options;
      
      // Check if DASHSCOPE_API_KEY is configured
      const apiKey = process.env.DASHSCOPE_API_KEY;
      if (!apiKey) {
        logger.warn('DASHSCOPE_API_KEY not configured, using mock response');
        // Mock response when API key is not configured
        return this._getMockTextResponse(prompt, model);
      }
      
      // Call Qwen API
      const response = await axios.post(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        {
          model: model || 'qwen-max',
          input: {
            prompt: prompt
          },
          parameters: {
            max_tokens: maxTokens || 1000,
            temperature: temperature || 0.7,
            seed: Math.floor(Math.random() * 10000)
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-DashScope-SSE': 'disable'
          }
        }
      );
      
      // Transform Qwen API response to OpenAI format
      const transformedResponse = {
        id: response.data.request_id,
        object: "text_completion",
        created: Math.floor(Date.now() / 1000),
        model: response.data.output.model,
        choices: [
          {
            text: response.data.output.text,
            index: 0,
            logprobs: null,
            finish_reason: response.data.output.finish_reason
          }
        ],
        usage: response.data.usage
      };
      
      return transformedResponse;
    } catch (error) {
      logger.error('LLM text generation failed', { 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Return mock response in case of error
      const { prompt, model } = options;
      return this._getMockTextResponse(prompt, model);
    }
  }
  
  /**
   * Get chat completion from LLM
   * @param {Object} options - Chat completion options
   * @returns {Promise<Object>} Chat completion response
   */
  async chatComplete(options) {
    try {
      const { messages, maxTokens, temperature, model } = options;
      
      // Check if DASHSCOPE_API_KEY is configured
      const apiKey = process.env.DASHSCOPE_API_KEY;
      if (!apiKey) {
        logger.warn('DASHSCOPE_API_KEY not configured, using mock response');
        // Mock response when API key is not configured
        return this._getMockChatResponse(messages, model);
      }
      
      // Call Qwen API
      const response = await axios.post(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/chat-completion/generation',
        {
          model: model || 'qwen-max',
          input: {
            messages: messages
          },
          parameters: {
            max_tokens: maxTokens || 1000,
            temperature: temperature || 0.7,
            seed: Math.floor(Math.random() * 10000)
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-DashScope-SSE': 'disable'
          }
        }
      );
      
      // Transform Qwen API response to OpenAI format
      const transformedResponse = {
        id: response.data.request_id,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: response.data.output.model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: response.data.output.text
            },
            finish_reason: response.data.output.finish_reason
          }
        ],
        usage: response.data.usage
      };
      
      return transformedResponse;
    } catch (error) {
      logger.error('LLM chat completion failed', { 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Return mock response in case of error
      const { messages, model } = options;
      return this._getMockChatResponse(messages, model);
    }
  }
  
  /**
   * Generate mock text response
   * @private
   */
  _getMockTextResponse(prompt, model) {
    return {
      id: `cmpl-${Math.random().toString(36).substr(2, 9)}`,
      object: "text_completion",
      created: Math.floor(Date.now() / 1000),
      model: model || 'qwen3-mock',
      choices: [
        {
          text: `这是基于您的提示"${prompt.substring(0, 20)}..."生成的模拟回复。在实际部署中，这将由Qwen3模型生成。请确保已配置DASHSCOPE_API_KEY环境变量以启用真实API调用。`,
          index: 0,
          logprobs: null,
          finish_reason: "length"
        }
      ],
      usage: {
        prompt_tokens: prompt.length,
        completion_tokens: 30,
        total_tokens: prompt.length + 30
      }
    };
  }
  
  /**
   * Generate mock chat response
   * @private
   */
  _getMockChatResponse(messages, model) {
    // Extract last message for response simulation
    const lastMessage = messages[messages.length - 1];
    const lastContent = typeof lastMessage.content === 'string' ? 
      lastMessage.content : 
      lastMessage.content.map(c => c.text || '').join(' ');
    
    return {
      id: `chatcmpl-${Math.random().toString(36).substr(2, 9)}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: model || 'qwen3-mock',
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: `这是对您消息"${lastContent.substring(0, 20)}..."的模拟回复。在实际部署中，这将由Qwen3模型生成。请确保已配置DASHSCOPE_API_KEY环境变量以启用真实API调用。`
          },
          finish_reason: "stop"
        }
      ],
      usage: {
        prompt_tokens: messages.reduce((acc, msg) => acc + (
          typeof msg.content === 'string' ? msg.content.length : 
          msg.content.reduce((sum, c) => sum + (c.text?.length || 0), 0)
        ), 0),
        completion_tokens: 35,
        total_tokens: messages.reduce((acc, msg) => acc + (
          typeof msg.content === 'string' ? msg.content.length : 
          msg.content.reduce((sum, c) => sum + (c.text?.length || 0), 0)
        ), 0) + 35
      }
    };
  }
}

module.exports = new LLMService();
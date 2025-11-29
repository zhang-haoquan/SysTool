// LLM controller for MCP Server

const BaseController = require('./baseController');
const LLMService = require('../services/llmService');
const { MCPError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class LLMController extends BaseController {
  constructor() {
    super();
  }

  /**
   * Get text completion from LLM
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTextCompletion(req, res, next) {
    try {
      const { prompt, max_tokens, temperature, model } = req.body;
      
      // Validate required parameters
      if (!prompt) {
        return this.sendError(res, 'Prompt is required', 400, 'MISSING_PROMPT');
      }
      
      const options = {
        prompt,
        maxTokens: max_tokens,
        temperature: temperature || 0.7,
        model: model || 'qwen3'
      };
      
      const result = await LLMService.generateText(options);
      
      logger.info('LLM text completion request processed', { 
        model: options.model,
        promptLength: prompt.length,
        ip: req.ip
      });
      
      this.sendSuccess(res, result);
    } catch (error) {
      logger.error('Failed to process LLM text completion request', { error: error.message });
      next(error);
    }
  }
  
  /**
   * Get chat completion from LLM
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getChatCompletion(req, res, next) {
    try {
      const { messages, max_tokens, temperature, model } = req.body;
      
      // Validate required parameters
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return this.sendError(res, 'Messages array is required', 400, 'MISSING_MESSAGES');
      }
      
      const options = {
        messages,
        maxTokens: max_tokens,
        temperature: temperature || 0.7,
        model: model || 'qwen3'
      };
      
      const result = await LLMService.chatComplete(options);
      
      logger.info('LLM chat completion request processed', { 
        model: options.model,
        messageCount: messages.length,
        ip: req.ip
      });
      
      this.sendSuccess(res, result);
    } catch (error) {
      logger.error('Failed to process LLM chat completion request', { error: error.message });
      next(error);
    }
  }
}

module.exports = new LLMController();
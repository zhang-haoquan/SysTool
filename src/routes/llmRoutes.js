// LLM Routes for MCP Server

const express = require('express');
const router = express.Router();
const llmController = require('../controllers/llmController');

/**
 * @swagger
 * /api/llm/completions:
 *   post:
 *     summary: Generate text completion
 *     description: Generate text completion using LLM
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The prompt for text generation
 *               max_tokens:
 *                 type: integer
 *                 description: Maximum number of tokens to generate
 *               temperature:
 *                 type: number
 *                 description: Sampling temperature
 *               model:
 *                 type: string
 *                 description: Model to use for generation
 *             required:
 *               - prompt
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/completions', llmController.getTextCompletion);

/**
 * @swagger
 * /api/llm/chat/completions:
 *   post:
 *     summary: Generate chat completion
 *     description: Generate chat completion using LLM
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                     content:
 *                       oneOf:
 *                         - type: string
 *                         - type: array
 *                           items:
 *                             type: object
 *                 description: Array of messages
 *               max_tokens:
 *                 type: integer
 *                 description: Maximum number of tokens to generate
 *               temperature:
 *                 type: number
 *                 description: Sampling temperature
 *               model:
 *                 type: string
 *                 description: Model to use for generation
 *             required:
 *               - messages
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/chat/completions', llmController.getChatCompletion);

module.exports = router;
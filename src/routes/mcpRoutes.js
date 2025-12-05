const express = require('express');
const MCPController = require('../controllers/mcpController');
const router = express.Router();
const mcpController = new MCPController();

/**
 * MCP Service Routes
 */

// Health check endpoint
router.get('/health', mcpController.healthCheck);

// MCP protocol endpoint
router.post('/', mcpController.handleMCPRequest);

// Get MCP capabilities
router.get('/capabilities', mcpController.getCapabilities);

// Fallback for unsupported methods
router.all('*', (req, res) => {
  res.status(405).json({
    error: 'Method not allowed',
    message: `Method ${req.method} is not supported on this endpoint`
  });
});

module.exports = router;